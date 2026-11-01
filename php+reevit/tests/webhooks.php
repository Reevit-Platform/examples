<?php

require __DIR__ . '/../vendor/autoload.php';

use App\WebhookController;

const SECRET = 'whsec_test';

function check(bool $ok, string $message): void {
    if (!$ok) throw new RuntimeException($message);
}

// Records which handler ran; the production handlers only log.
class RecordingController extends WebhookController
{
    public array $calls = [];
    protected function handlePaymentSucceeded(array $data): void { $this->calls[] = 'succeeded'; }
    protected function handlePaymentFailed(array $data): void { $this->calls[] = 'failed'; }
    protected function handlePaymentRefunded(array $data): void { $this->calls[] = 'refunded'; }
}

function deliver(array $body, ?string $signature = null): array {
    $raw = json_encode($body);
    $controller = new RecordingController(SECRET);
    $signature ??= 'sha256=' . hash_hmac('sha256', $raw, SECRET);
    $result = @$controller->handle($raw, $signature);
    return [$result, $controller->calls];
}

function production(string $status): array {
    return [
        'event' => 'payment.updated', 'org_id' => 'org_123', 'timestamp' => '2026-02-10T10:05:00Z',
        'api_version' => '2026-03-05', 'delivery_id' => '3f2a1c9e', 'attempt' => 1, 'mode' => 'live',
        'data' => ['id' => 'pay_xyz789', 'amount' => 5000, 'currency' => 'GHS', 'status' => $status,
            'provider' => 'paystack', 'customer_id' => 'cust_456', 'metadata' => ['order_id' => '12345']],
    ];
}

[$result, $calls] = deliver(production('succeeded'));
check($result === ['received' => true] && $calls === ['succeeded'], 'production succeeded did not dispatch');

[$result, $calls] = deliver(production('failed'));
check($result === ['received' => true] && $calls === ['failed'], 'production failed did not dispatch');

[$result, $calls] = deliver(['id' => 'evt_1', 'type' => 'payment.updated',
    'data' => ['id' => 'pay_1', 'status' => 'succeeded', 'amount' => 100, 'currency' => 'GHS']]);
check($result === ['received' => true] && $calls === ['succeeded'], 'legacy type envelope did not dispatch');

[$result, $calls] = deliver(['event' => 'reevit.webhook.test', 'message' => 'hello']);
check($result === ['received' => true] && $calls === [], 'test event dispatched a payment handler');

[$result, $calls] = deliver(['event' => 'refund.succeeded', 'data' => [
    'id' => 'ref_1', 'payment_id' => 'pay_1', 'status' => 'succeeded', 'amount' => 100, 'currency' => 'GHS']]);
check($result === ['received' => true] && $calls === ['refunded'], 'refund.succeeded did not dispatch');

[$result, $calls] = deliver(production('succeeded'), 'sha256=deadbeef');
check($result === ['error' => 'Invalid signature'] && $calls === [], 'bad signature was accepted');

echo "webhook contract ok\n";
