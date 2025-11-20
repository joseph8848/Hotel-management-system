<?php
// Ensure we're getting JSON for POST/PUT requests
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    $content_type = $_SERVER['CONTENT_TYPE'] ?? '';
    if (strpos($content_type, 'application/json') === false) {
        http_response_code(415);
        echo json_encode([
            'status' => 'error',
            'message' => 'Content-Type must be application/json'
        ]);
        exit();
    }
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid JSON: ' . json_last_error_msg()
        ]);
        exit();
    }
    
    // Make JSON data available in $_POST
    $_POST = $input;
}
