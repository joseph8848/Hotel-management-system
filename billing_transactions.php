<?php
require_once __DIR__ . '/includes/auth.php';

guard_route('admin');

readfile(__DIR__ . '/billing_transactions.html');
