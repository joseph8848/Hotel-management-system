<?php
require_once __DIR__ . '/includes/auth.php';

guard_route('staff');

readfile(__DIR__ . '/dashboard_staff.html');
