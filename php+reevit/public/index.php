<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\PaymentController;
use App\WebhookController;

// CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simple router
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Load environment variables
$apiKey = getenv('REEVIT_API_KEY') ?: 'pk_test_demo';
$webhookSecret = getenv('REEVIT_WEBHOOK_SECRET') ?: '';

// Initialize controllers
$paymentController = new PaymentController($apiKey);
$webhookController = new WebhookController($webhookSecret);

try {
    // Routes
    if ($path === '/health' && $method === 'GET') {
        echo json_encode(['status' => 'ok']);
    }
    // Create payment
    elseif ($path === '/api/payments' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $paymentController->create($input);
        echo json_encode($result);
    }
    // Get payment by ID
    elseif (preg_match('#^/api/payments/([a-zA-Z0-9_-]+)$#', $path, $matches) && $method === 'GET') {
        $result = $paymentController->get($matches[1]);
        echo json_encode($result);
    }
    // List payments
    elseif ($path === '/api/payments' && $method === 'GET') {
        $result = $paymentController->list();
        echo json_encode($result);
    }
    // Webhooks
    elseif ($path === '/webhooks/reevit' && $method === 'POST') {
        $payload = file_get_contents('php://input');
        $signature = $_SERVER['HTTP_X_REEVIT_SIGNATURE'] ?? '';
        $result = $webhookController->handle($payload, $signature);
        echo json_encode($result);
    }
    // 404
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
} catch (Exception $e) {
    error_log("[Error] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
