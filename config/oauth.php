<?php
function oauth_env($key, $default = '') {
  $v = getenv($key);
  if ($v === false || $v === null) return $default;
  return $v;
}

function oauth_config($provider) {
  if ($provider === 'google') {
    return [
      'client_id' => oauth_env('GOOGLE_CLIENT_ID'),
      'client_secret' => oauth_env('GOOGLE_CLIENT_SECRET'),
      'scope' => 'openid email profile',
      'auth_url' => 'https://accounts.google.com/o/oauth2/v2/auth',
      'token_url' => 'https://oauth2.googleapis.com/token',
      'userinfo_url' => 'https://openidconnect.googleapis.com/v1/userinfo',
    ];
  }
  if ($provider === 'facebook') {
    return [
      'client_id' => oauth_env('FACEBOOK_CLIENT_ID'),
      'client_secret' => oauth_env('FACEBOOK_CLIENT_SECRET'),
      'scope' => 'email,public_profile',
      'auth_url' => 'https://www.facebook.com/v17.0/dialog/oauth',
      'token_url' => 'https://graph.facebook.com/v17.0/oauth/access_token',
      'userinfo_url' => 'https://graph.facebook.com/me?fields=id,name,email',
    ];
  }
  if ($provider === 'twitter') {
    return [
      'client_id' => oauth_env('TWITTER_CLIENT_ID'),
      'client_secret' => oauth_env('TWITTER_CLIENT_SECRET'),
      'scope' => 'tweet.read users.read offline.access',
      'auth_url' => 'https://twitter.com/i/oauth2/authorize',
      'token_url' => 'https://api.twitter.com/2/oauth2/token',
      'userinfo_url' => 'https://api.twitter.com/2/users/me',
    ];
  }
  return [];
}

function oauth_base_url() {
  $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
  $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
  return $scheme . '://' . $host;
}