<?php
// User login
if ($endpoint === '/auth/login' && $method === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Email and password are required'
        ]);
        exit();
    }
    
    $stmt = $db->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email or password'
        ]);
        exit();
    }
    
    // Set session
    $_SESSION['user'] = [
        'id' => $user['id'],
        'email' => $user['email'],
        'user_type' => $user['user_type'],
        'full_name' => $user['full_name']
    ];
    
    // Regenerate session ID for security
    session_regenerate_id(true);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'data' => [
            'user' => $_SESSION['user'],
            'session_id' => session_id()
        ]
    ]);
    exit();
}

// User logout
if ($endpoint === '/auth/logout' && $method === 'POST') {
    session_destroy();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Logout successful'
    ]);
    exit();
}

// Get current user
if ($endpoint === '/auth/me' && $method === 'GET') {
    $user = current_user();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Not authenticated'
        ]);
        exit();
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $user
    ]);
    exit();
}
