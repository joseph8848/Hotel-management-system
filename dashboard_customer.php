<?php
require_once __DIR__ . '/includes/auth.php';

guard_route('customer');

readfile(__DIR__ . '/dashboard_customer.html');
