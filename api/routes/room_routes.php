<?php
$db = get_db_connection();
$roomController = new RoomController($db);

// Get available rooms
if ($endpoint === '/rooms/available' && $method === 'GET') {
    $checkIn = $_GET['check_in'] ?? date('Y-m-d');
    $checkOut = $_GET['check_out'] ?? date('Y-m-d', strtotime('+1 day'));
    
    $rooms = $roomController->getAvailableRooms($checkIn, $checkOut);
    echo json_encode([
        'status' => 'success',
        'data' => $rooms
    ]);
    exit();
}

// Get all rooms (admin only)
if ($endpoint === '/rooms' && $method === 'GET') {
    require_auth(['admin', 'staff']);
    
    $rooms = $roomController->getAllRooms();
    echo json_encode([
        'status' => 'success',
        'data' => $rooms
    ]);
    exit();
}

// Get single room
if (preg_match('/^\/rooms\/(\d+)$/', $endpoint, $matches) && $method === 'GET') {
    $roomId = $matches[1];
    $room = $roomController->getRoom($roomId);
    
    echo json_encode([
        'status' => 'success',
        'data' => $room
    ]);
    exit();
}

// Create new room (admin only)
if ($endpoint === '/rooms' && $method === 'POST') {
    $user = require_auth(['admin']);
    
    $data = $_POST;
    $room = $roomController->createRoom($data);
    
    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Room created successfully',
        'data' => $room
    ]);
    exit();
}
