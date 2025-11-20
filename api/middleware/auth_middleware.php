<?php
function require_auth(array $allowed_roles = []) {
    $user = current_user();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Authentication required'
        ]);
        exit();
    }
    
    if (!empty($allowed_roles) && !in_array($user['user_type'], $allowed_roles, true)) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Insufficient permissions'
        ]);
        exit();
    }
    
    return $user;
}
