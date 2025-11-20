<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

/**
 * Retrieve the current authenticated user from the session.
 */
function current_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

/**
 * Enforce authentication and optionally restrict allowed roles.
 *
 * @param string|array|null $allowedRoles
 */
function guard_route($allowedRoles = null): void
{
    $user = current_user();
    if (!$user) {
        header('Location: login.html?error=auth');
        exit();
    }

    if ($allowedRoles === null) {
        return;
    }

    if (is_string($allowedRoles)) {
        $allowedRoles = [$allowedRoles];
    }

    if (!in_array($user['user_type'] ?? '', $allowedRoles, true)) {
        header('Location: access_denied.html');
        exit();
    }
}

/**
 * Log the current user out and destroy the session.
 */
function logout_user(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
}
