<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/middleware/json_middleware.php';
require_once __DIR__ . '/middleware/auth_middleware.php';

// Set headers for CORS and JSON response
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple router
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base_path = '/api';
$endpoint = str_replace($base_path, '', $request_uri);
$method = $_SERVER['REQUEST_METHOD'];

// Include route files
require_once __DIR__ . '/routes/auth_routes.php';
require_once __DIR__ . '/routes/room_routes.php';
require_once __DIR__ . '/routes/booking_routes.php';
require_once __DIR__ . '/routes/food_order_routes.php';

// Handle 404
http_response_code(404);
echo json_encode([
    'status' => 'error',
    'message' => 'Endpoint not found',
    'path' => $endpoint
]);
