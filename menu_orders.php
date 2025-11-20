<?php
require_once __DIR__ . '/includes/auth.php';

guard_route('admin');

// Handle Server-Sent Events for real-time updates
if (isset($_GET['sse'])) {
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');

    $pdo = get_db_connection();
    $last_id = 0;

    while (true) {
        // Get new orders since last check
        $stmt = $pdo->prepare("SELECT id, room_id, status, order_time, estimated_delivery_time FROM food_orders WHERE id > ? ORDER BY id DESC");
        $stmt->execute([$last_id]);
        $new_orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($new_orders)) {
            foreach ($new_orders as $order) {
                echo "data: " . json_encode([
                    'type' => 'new_order',
                    'order' => $order
                ]) . "\n\n";
                $last_id = max($last_id, $order['id']);
            }
            ob_flush();
            flush();
        }

        // Check for status updates
        $stmt = $pdo->prepare("SELECT id, status, delivery_time FROM food_orders WHERE status IN ('preparing', 'ready', 'delivered', 'cancelled') AND id > ?");
        $stmt->execute([$last_id]);
        $status_updates = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($status_updates)) {
            foreach ($status_updates as $update) {
                echo "data: " . json_encode([
                    'type' => 'status_update',
                    'order_id' => $update['id'],
                    'status' => $update['status'],
                    'delivery_time' => $update['delivery_time']
                ]) . "\n\n";
                ob_flush();
                flush();
            }
        }

        sleep(2); // Check every 2 seconds
    }
    exit();
}

// Handle AJAX requests for real-time updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');

    try {
        $pdo = get_db_connection();

        switch ($_POST['action']) {
            case 'update_order_status':
                $order_id = filter_var($_POST['order_id'], FILTER_SANITIZE_STRING);
                $new_status = filter_var($_POST['status'], FILTER_SANITIZE_STRING);

                // Validate status
                $valid_statuses = ['ordered', 'preparing', 'ready', 'delivered', 'cancelled'];
                if (!in_array($new_status, $valid_statuses)) {
                    throw new Exception('Invalid status');
                }

                // Set delivery time when order is delivered
                $delivery_time = null;
                if ($new_status === 'delivered') {
                    $delivery_time = date('Y-m-d H:i:s');
                }

                // Set estimated delivery time when order starts preparing (if not set)
                $estimated_time = null;
                if ($new_status === 'preparing') {
                    $stmt = $pdo->prepare("SELECT estimated_delivery_time FROM food_orders WHERE id = ?");
                    $stmt->execute([$order_id]);
                    $current = $stmt->fetch(PDO::FETCH_ASSOC);
                    if (!$current['estimated_delivery_time']) {
                        $estimated_time = date('Y-m-d H:i:s', strtotime('+25 minutes')); // 25 min prep time
                    }
                }

                $stmt = $pdo->prepare("UPDATE food_orders SET status = ?, delivery_time = ?, estimated_delivery_time = ? WHERE id = ?");
                $stmt->execute([$new_status, $delivery_time, $estimated_time, $order_id]);

                echo json_encode(['success' => true, 'message' => 'Order status updated']);
                break;

            case 'get_orders':
                $stmt = $pdo->query("SELECT id, room_id, status, order_time, estimated_delivery_time, delivery_time, total_amount FROM food_orders ORDER BY order_time DESC");
                $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Get order items for each order
                foreach ($orders as &$order) {
                    $itemStmt = $pdo->prepare("SELECT item_name, quantity, price FROM order_items WHERE order_id = ?");
                    $itemStmt->execute([$order['id']]);
                    $order['items'] = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
                }

                echo json_encode(['success' => true, 'orders' => $orders]);
                break;

            default:
                throw new Exception('Invalid action');
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

readfile(__DIR__ . '/menu_orders.html');
