<?php
class RoomController {
    private $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAvailableRooms($checkIn, $checkOut) {
        $query = "
            SELECT r.* 
            FROM rooms r
            WHERE r.status = 'available'
            AND r.id NOT IN (
                SELECT room_id 
                FROM reservations 
                WHERE 
                    (check_in <= :check_out AND check_out >= :check_in)
                    AND status IN ('confirmed', 'checked_in')
            )
        ";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            ':check_in' => $checkIn,
            ':check_out' => $checkOut
        ]);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getRoom($id) {
        $stmt = $this->db->prepare("SELECT * FROM rooms WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $room = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$room) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Room not found'
            ]);
            exit();
        }
        
        return $room;
    }

    public function getAllRooms() {
        $stmt = $this->db->query("SELECT * FROM rooms ORDER BY room_number");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createRoom($data) {
        $required = ['room_number', 'room_type', 'rate'];
        $this->validateInput($data, $required);
        
        $query = "
            INSERT INTO rooms (room_number, room_type, rate, status)
            VALUES (:room_number, :room_type, :rate, :status)
        ";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            ':room_number' => $data['room_number'],
            ':room_type' => $data['room_type'],
            ':rate' => $data['rate'],
            ':status' => $data['status'] ?? 'available'
        ]);
        
        $roomId = $this->db->lastInsertId();
        return $this->getRoom($roomId);
    }
    
    private function validateInput($data, $required) {
        $missing = [];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing required fields',
                'missing_fields' => $missing
            ]);
            exit();
        }
    }
}
