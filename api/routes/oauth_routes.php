<?php
require_once __DIR__ . '/../../config/oauth.php';

function oauth_redirect($url) {
  header('Location: ' . $url);
  exit();
}

function oauth_html_close($status, $provider, $payload = []) {
  header('Content-Type: text/html; charset=utf-8');
  $data = [
    'type' => 'oauth',
    'status' => $status,
    'provider' => $provider,
    'data' => $payload,
  ];
  $json = json_encode($data);
  echo '<!doctype html><html><head><meta charset="utf-8"><title>OAuth</title></head><body>';
  echo '<script>try{var d=' . $json . ';if(window.opener){window.opener.postMessage(d,"*");}window.close();}catch(e){}</script>';
  echo '</body></html>';
  exit();
}

function oauth_upsert_user($db, $email, $name) {
  $stmt = $db->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
  $stmt->execute([':email' => $email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$user) {
    $pwd = bin2hex(random_bytes(16));
    $hash = password_hash($pwd, PASSWORD_DEFAULT);
    $stmt = $db->prepare('INSERT INTO users (user_type, email, username, password_hash, full_name) VALUES (:type, :email, :username, :hash, :name)');
    $stmt->execute([
      ':type' => 'customer',
      ':email' => $email,
      ':username' => null,
      ':hash' => $hash,
      ':name' => $name,
    ]);
    $id = (int)$db->lastInsertId();
    $user = [
      'id' => $id,
      'email' => $email,
      'user_type' => 'customer',
      'full_name' => $name,
    ];
  } else {
    $user = [
      'id' => (int)$user['id'],
      'email' => $user['email'],
      'user_type' => $user['user_type'],
      'full_name' => $user['full_name'],
    ];
  }
  $_SESSION['user'] = $user;
  session_regenerate_id(true);
  return $user;
}

if ($endpoint === '/auth/oauth/google/start' && $method === 'GET') {
  $cfg = oauth_config('google');
  $client_id = $cfg['client_id'] ?? '';
  if (!$client_id) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Google OAuth not configured']);
    exit();
  }
  $state = bin2hex(random_bytes(16));
  $_SESSION['oauth_state_google'] = $state;
  $redirect_uri = oauth_base_url() . '/api/auth/oauth/google/callback';
  $params = [
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri,
    'response_type' => 'code',
    'scope' => $cfg['scope'],
    'access_type' => 'offline',
    'include_granted_scopes' => 'true',
    'prompt' => 'select_account',
    'state' => $state,
  ];
  $url = $cfg['auth_url'] . '?' . http_build_query($params);
  oauth_redirect($url);
}

if ($endpoint === '/auth/oauth/google/callback' && $method === 'GET') {
  $state = $_GET['state'] ?? '';
  $code = $_GET['code'] ?? '';
  if (!$code || !$state || (($_SESSION['oauth_state_google'] ?? '') !== $state)) {
    oauth_html_close('error', 'google', ['message' => 'Invalid state or code']);
  }
  $cfg = oauth_config('google');
  $redirect_uri = oauth_base_url() . '/api/auth/oauth/google/callback';
  $payload = [
    'code' => $code,
    'client_id' => $cfg['client_id'],
    'client_secret' => $cfg['client_secret'],
    'redirect_uri' => $redirect_uri,
    'grant_type' => 'authorization_code',
  ];
  $ch = curl_init($cfg['token_url']);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
  $resp = curl_exec($ch);
  $code_http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($code_http !== 200) {
    oauth_html_close('error', 'google', ['message' => 'Token exchange failed']);
  }
  $tok = json_decode($resp, true);
  $access = $tok['access_token'] ?? '';
  if (!$access) {
    oauth_html_close('error', 'google', ['message' => 'No access token']);
  }
  $uCh = curl_init($cfg['userinfo_url']);
  curl_setopt($uCh, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($uCh, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $access]);
  $uResp = curl_exec($uCh);
  curl_close($uCh);
  $u = json_decode($uResp, true);
  $email = $u['email'] ?? '';
  $name = $u['name'] ?? '';
  if (!$email) {
    oauth_html_close('error', 'google', ['message' => 'Email missing']);
  }
  $user = oauth_upsert_user($db, $email, $name);
  oauth_html_close('success', 'google', ['user' => $user]);
}

if ($endpoint === '/auth/oauth/facebook/start' && $method === 'GET') {
  $cfg = oauth_config('facebook');
  $client_id = $cfg['client_id'] ?? '';
  if (!$client_id) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Facebook OAuth not configured']);
    exit();
  }
  $state = bin2hex(random_bytes(16));
  $_SESSION['oauth_state_facebook'] = $state;
  $redirect_uri = oauth_base_url() . '/api/auth/oauth/facebook/callback';
  $params = [
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri,
    'response_type' => 'code',
    'scope' => $cfg['scope'],
    'state' => $state,
  ];
  $url = $cfg['auth_url'] . '?' . http_build_query($params);
  oauth_redirect($url);
}

if ($endpoint === '/auth/oauth/facebook/callback' && $method === 'GET') {
  $state = $_GET['state'] ?? '';
  $code = $_GET['code'] ?? '';
  if (!$code || !$state || (($_SESSION['oauth_state_facebook'] ?? '') !== $state)) {
    oauth_html_close('error', 'facebook', ['message' => 'Invalid state or code']);
  }
  $cfg = oauth_config('facebook');
  $redirect_uri = oauth_base_url() . '/api/auth/oauth/facebook/callback';
  $params = [
    'client_id' => $cfg['client_id'],
    'client_secret' => $cfg['client_secret'],
    'redirect_uri' => $redirect_uri,
    'code' => $code,
  ];
  $url = $cfg['token_url'] . '?' . http_build_query($params);
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $resp = curl_exec($ch);
  $code_http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($code_http !== 200) {
    oauth_html_close('error', 'facebook', ['message' => 'Token exchange failed']);
  }
  $tok = json_decode($resp, true);
  $access = $tok['access_token'] ?? '';
  if (!$access) {
    oauth_html_close('error', 'facebook', ['message' => 'No access token']);
  }
  $uUrl = $cfg['userinfo_url'] . '&access_token=' . urlencode($access);
  $uCh = curl_init($uUrl);
  curl_setopt($uCh, CURLOPT_RETURNTRANSFER, true);
  $uResp = curl_exec($uCh);
  curl_close($uCh);
  $u = json_decode($uResp, true);
  $email = $u['email'] ?? '';
  $name = $u['name'] ?? '';
  if (!$email) {
    oauth_html_close('error', 'facebook', ['message' => 'Email missing']);
  }
  $user = oauth_upsert_user($db, $email, $name);
  oauth_html_close('success', 'facebook', ['user' => $user]);
}

if ($endpoint === '/auth/oauth/twitter/start' && $method === 'GET') {
  http_response_code(501);
  echo json_encode(['status' => 'error', 'message' => 'Twitter OAuth requires configuration']);
  exit();
}

if ($endpoint === '/auth/oauth/twitter/callback' && $method === 'GET') {
  oauth_html_close('error', 'twitter', ['message' => 'Not configured']);
}