<?php
/**
 * Booking API - Champion Hotel Management System
 * Handles room availability checking and booking creation
 */

session_start();

// Security headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CORS headers (adjust origin as needed)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/db.php';

/**
 * Send JSON response
 */
function sendResponse($data, $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

/**
 * Send error response
 */
function sendError($message, $statusCode = 400): void
{
    sendResponse(['error' => $message], $statusCode);
}

/**
 * Validate date format
 */
function validateDate($date): bool
{
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

/**
 * Get available rooms for date range
 */
function getAvailableRooms($checkIn, $checkOut): array
{
    try {
        $pdo = get_db_connection();
        
        // Find rooms that are not booked for the given date range
        $sql = "
            SELECT r.* 
            FROM rooms r
            WHERE r.status = 'available'
            AND r.id NOT IN (
                SELECT DISTINCT room_id 
                FROM reservations 
                WHERE status IN ('confirmed', 'checked_in')
                AND (
                    (check_in <= :check_in AND check_out > :check_in)
                    OR (check_in < :check_out AND check_out >= :check_out)
                    OR (check_in >= :check_in AND check_out <= :check_out)
                )
            )
            ORDER BY r.rate ASC
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'check_in' => $checkIn,
            'check_out' => $checkOut
        ]);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log('Database error in getAvailableRooms: ' . $e->getMessage());
        return [];
    }
}

/**
 * Create a new booking
 */
function createBooking($data): array
{
    try {
        $pdo = get_db_connection();
        
        // Start transaction
        $pdo->beginTransaction();
        
        // Verify room is still available
        $availableRooms = getAvailableRooms($data['check_in'], $data['check_out']);
        $roomAvailable = false;
        
        foreach ($availableRooms as $room) {
            if ($room['id'] == $data['room_id']) {
                $roomAvailable = true;
                break;
            }
        }
        
        if (!$roomAvailable) {
            $pdo->rollBack();
            sendError('Selected room is no longer available', 409);
        }
        
        // Create or get user
        $userId = createOrGetUser($pdo, $data['guest_details']);
        
        // Create reservation
        $reference = 'CHM' . time() . rand(1000, 9999);
        
        $sql = "
            INSERT INTO reservations (
                user_id, room_id, check_in, check_out, 
                guests, status, notes, created_at
            ) VALUES (
                :user_id, :room_id, :check_in, :check_out,
                :guests, 'confirmed', :notes, NOW()
            )
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'user_id' => $userId,
            'room_id' => $data['room_id'],
            'check_in' => $data['check_in'],
            'check_out' => $data['check_out'],
            'guests' => $data['guests'],
            'notes' => $data['guest_details']['special_requests'] ?? null
        ]);
        
        $reservationId = $pdo->lastInsertId();
        
        // Calculate total amount
        $roomRate = $pdo->query("SELECT rate FROM rooms WHERE id = {$data['room_id']}")->fetchColumn();
        $checkIn = new DateTime($data['check_in']);
        $checkOut = new DateTime($data['check_out']);
        $nights = $checkIn->diff($checkOut)->days;
        $subtotal = $roomRate * $nights;
        $tax = $subtotal * 0.16;
        $total = $subtotal + $tax;
        
        // Create invoice
        $sql = "
            INSERT INTO invoices (
                user_id, reservation_id, reference, 
                amount_due, amount_paid, status, issued_at
            ) VALUES (
                :user_id, :reservation_id, :reference,
                :amount_due, 0, 'pending', NOW()
            )
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'user_id' => $userId,
            'reservation_id' => $reservationId,
            'reference' => $reference,
            'amount_due' => $total
        ]);
        
        // Log the booking
        $sql = "
            INSERT INTO audit_log (user_id, action, details, logged_at)
            VALUES (:user_id, 'booking_created', :details, NOW())
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'user_id' => $userId,
            'details' => json_encode([
                'reservation_id' => $reservationId,
                'reference' => $reference,
                'room_id' => $data['room_id'],
                'check_in' => $data['check_in'],
                'check_out' => $data['check_out']
            ])
        ]);
        
        // Commit transaction
        $pdo->commit();
        
        return [
            'success' => true,
            'booking_reference' => $reference,
            'reservation_id' => $reservationId,
            'total_amount' => $total,
            'message' => 'Booking created successfully'
        ];
        
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log('Database error in createBooking: ' . $e->getMessage());
        sendError('Failed to create booking. Please try again.', 500);
    }
}

/**
 * Create or get existing user
 */
function createOrGetUser($pdo, $guestDetails): int
{
    // Check if user exists by email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $guestDetails['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        return $user['id'];
    }
    
    // Create new user
    $password = bin2hex(random_bytes(16)); // Generate random password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "
        INSERT INTO users (
            user_type, email, password_hash, full_name, created_at
        ) VALUES (
            'customer', :email, :password_hash, :full_name, NOW()
        )
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'email' => $guestDetails['email'],
        'password_hash' => $passwordHash,
        'full_name' => $guestDetails['full_name']
    ]);
    
    return $pdo->lastInsertId();
}

// ============================================
// ROUTE HANDLING
// ============================================

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($method) {
        case 'GET':
            if ($action === 'available_rooms') {
                // Get available rooms
                $checkIn = $_GET['check_in'] ?? '';
                $checkOut = $_GET['check_out'] ?? '';
                
                if (!validateDate($checkIn) || !validateDate($checkOut)) {
                    sendError('Invalid date format. Use YYYY-MM-DD');
                }
                
                if (strtotime($checkOut) <= strtotime($checkIn)) {
                    sendError('Check-out date must be after check-in date');
                }
                
                $rooms = getAvailableRooms($checkIn, $checkOut);
                sendResponse(['rooms' => $rooms]);
            } else {
                sendError('Invalid action', 404);
            }
            break;
            
        case 'POST':
            if ($action === 'create_booking') {
                // Create booking
                $input = json_decode(file_get_contents('php://input'), true);
                
                if (!$input) {
                    sendError('Invalid JSON data');
                }
                
                // Validate required fields
                $required = ['room_id', 'check_in', 'check_out', 'guests', 'guest_details'];
                foreach ($required as $field) {
                    if (!isset($input[$field])) {
                        sendError("Missing required field: $field");
                    }
                }
                
                // Validate dates
                if (!validateDate($input['check_in']) || !validateDate($input['check_out'])) {
                    sendError('Invalid date format');
                }
                
                // Validate guest details
                $guestRequired = ['full_name', 'email', 'phone', 'id_number'];
                foreach ($guestRequired as $field) {
                    if (empty($input['guest_details'][$field])) {
                        sendError("Missing guest detail: $field");
                    }
                }
                
                // Create booking
                $result = createBooking($input);
                sendResponse($result, 201);
            } else {
                sendError('Invalid action', 404);
            }
            break;
            
        default:
            sendError('Method not allowed', 405);
    }
} catch (Exception $e) {
    error_log('API error: ' . $e->getMessage());
    sendError('An unexpected error occurred', 500);
}