<?php
if ($endpoint === '/booking' && $method === 'POST') {
    $data = $_POST ?? [];
    $required = ['room_id', 'check_in', 'check_out', 'guests', 'guest_details'];
    foreach ($required as $f) {
        if (!isset($data[$f])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing field', 'field' => $f]);
            exit();
        }
    }
    $ci = $data['check_in'];
    $co = $data['check_out'];
    $d1 = DateTime::createFromFormat('Y-m-d', $ci);
    $d2 = DateTime::createFromFormat('Y-m-d', $co);
    if (!$d1 || !$d2 || $d1->format('Y-m-d') !== $ci || $d2->format('Y-m-d') !== $co || strtotime($co) <= strtotime($ci)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid dates']);
        exit();
    }
    $g = $data['guest_details'];
    $guestRequired = ['full_name', 'email', 'phone', 'id_number'];
    foreach ($guestRequired as $f) {
        if (!isset($g[$f]) || trim((string)$g[$f]) === '') {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing guest detail', 'field' => $f]);
            exit();
        }
    }
    try {
        $db->beginTransaction();
        $q = $db->prepare(
            "SELECT COUNT(*) FROM rooms r WHERE r.id = :id AND r.status = 'available' AND r.id NOT IN (
             SELECT room_id FROM reservations WHERE (check_in <= :co AND check_out >= :ci) AND status IN ('confirmed','checked_in'))"
        );
        $q->execute([':id' => $data['room_id'], ':ci' => $ci, ':co' => $co]);
        $ok = (int)$q->fetchColumn() > 0;
        if (!$ok) {
            $db->rollBack();
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Room unavailable']);
            exit();
        }
        $uSel = $db->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $uSel->execute([':email' => $g['email']]);
        $uRow = $uSel->fetch(PDO::FETCH_ASSOC);
        if ($uRow) {
            $userId = (int)$uRow['id'];
        } else {
            $pwd = bin2hex(random_bytes(16));
            $hash = password_hash($pwd, PASSWORD_DEFAULT);
            $uIns = $db->prepare('INSERT INTO users (user_type, email, password_hash, full_name) VALUES ("customer", :email, :hash, :name)');
            $uIns->execute([':email' => $g['email'], ':hash' => $hash, ':name' => $g['full_name']]);
            $userId = (int)$db->lastInsertId();
        }
        $ref = 'CHM' . time() . rand(1000, 9999);
        $rIns = $db->prepare('INSERT INTO reservations (user_id, room_id, check_in, check_out, guests, status, notes, created_at) VALUES (:uid, :rid, :ci, :co, :guests, "confirmed", :notes, NOW())');
        $rIns->execute([
            ':uid' => $userId,
            ':rid' => $data['room_id'],
            ':ci' => $ci,
            ':co' => $co,
            ':guests' => $data['guests'],
            ':notes' => $g['special_requests'] ?? null,
        ]);
        $resId = (int)$db->lastInsertId();
        $rateStmt = $db->prepare('SELECT rate FROM rooms WHERE id = :id');
        $rateStmt->execute([':id' => $data['room_id']]);
        $rate = (float)$rateStmt->fetchColumn();
        $nights = (new DateTime($co))->diff(new DateTime($ci))->days;
        $subtotal = $rate * $nights;
        $tax = $subtotal * 0.16;
        $total = $subtotal + $tax;
        $iIns = $db->prepare('INSERT INTO invoices (user_id, reservation_id, reference, amount_due, amount_paid, status, issued_at) VALUES (:uid, :rid, :ref, :due, 0, "pending", NOW())');
        $iIns->execute([':uid' => $userId, ':rid' => $resId, ':ref' => $ref, ':due' => $total]);
        $aIns = $db->prepare('INSERT INTO audit_log (user_id, action, details, logged_at) VALUES (:uid, :act, :det, NOW())');
        $aIns->execute([':uid' => $userId, ':act' => 'booking_created', ':det' => json_encode(['reservation_id' => $resId, 'reference' => $ref, 'room_id' => $data['room_id'], 'check_in' => $ci, 'check_out' => $co])]);
        $db->commit();
        echo json_encode(['status' => 'success', 'message' => 'Booking created', 'data' => ['booking_reference' => $ref, 'reservation_id' => $resId, 'total_amount' => $total]]);
        exit();
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to create booking']);
        exit();
    }
}