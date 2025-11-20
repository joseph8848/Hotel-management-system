<?php
require_once __DIR__ . '/includes/auth.php';

guard_route('admin');

readfile(__DIR__ . '/dashboard_admin.html');
