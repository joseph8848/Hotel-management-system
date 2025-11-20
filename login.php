<?php
session_start();

// Security headers
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');

// Enforce HTTPS in production
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    if (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] !== 'localhost') {
        header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
        exit();
    }
}

// Session security settings
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Strict');

// Session timeout (30 minutes)
$session_timeout = 1800;
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $session_timeout) {
    session_unset();
    session_destroy();
    header('Location: login.html?error=session_expired');
    exit();
}
$_SESSION['last_activity'] = time();

require_once __DIR__ . '/config/db.php';

function redirect_with_error(string $errorCode, string $userType = 'customer'): void
{
    $params = http_build_query([
        'error' => $errorCode,
        'user_type' => $userType,
    ]);
    header("Location: login.html?{$params}");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_with_error('invalid_method');
}

$userType = $_POST['user_type'] ?? 'customer';

// Input validation and sanitization
$userType = filter_var($userType, FILTER_SANITIZE_STRING);
if (!in_array($userType, ['customer', 'staff', 'admin'])) {
    redirect_with_error('invalid_user_type');
}

$password = trim($_POST['password'] ?? '');

// Enhanced password validation
if ($password === '' || strlen($password) < 8) {
    redirect_with_error('invalid_password', $userType);
}

try {
    $pdo = get_db_connection();
} catch (Throwable $exception) {
    error_log('Login connection error: ' . $exception->getMessage());
    redirect_with_error('server', $userType);
}

$identifierField = $userType === 'customer' ? 'email' : 'username';
$identifierValue = trim($_POST[$identifierField] ?? '');

// Enhanced identifier validation
if ($identifierValue === '') {
    redirect_with_error('missing_identifier', $userType);
}

// Email validation for customers
if ($userType === 'customer' && !filter_var($identifierValue, FILTER_VALIDATE_EMAIL)) {
    redirect_with_error('invalid_email', $userType);
}

// Sanitize identifier
$identifierValue = filter_var($identifierValue, FILTER_SANITIZE_STRING);

$query = sprintf(
    'SELECT id, user_type, email, username, password_hash, full_name FROM users WHERE user_type = :user_type AND %s = :identifier LIMIT 1',
    $identifierField
);

$statement = $pdo->prepare($query);
$statement->execute([
    'user_type' => $userType,
    'identifier' => $identifierValue,
]);

$user = $statement->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    redirect_with_error('invalid_credentials', $userType);
}

$_SESSION['user'] = [
    'id' => $user['id'],
    'user_type' => $user['user_type'],
    'email' => $user['email'],
    'username' => $user['username'],
    'full_name' => $user['full_name'],
];

switch ($user['user_type']) {
    case 'admin':
        header('Location: dashboard_admin.php');
        break;
    case 'staff':
        header('Location: dashboard_staff.php');
        break;
    default:
        header('Location: dashboard_customer.php');
        break;
}

exit();
