<?php

namespace App;

class WebhookController
{
    private string $secret;

    public function __construct(string $secret)
    {
        $this->secret = $secret;
    }

    /**
     * Verify webhook signature using HMAC-SHA256
     */
    private function verifySignature(string $payload, string $signature): bool
    {
        if (!str_starts_with($signature, 'sha256=')) {
            return false;
        }

        $expected = hash_hmac('sha256', $payload, $this->secret);
        $received = substr($signature, 7); // Remove "sha256=" prefix

        return hash_equals($expected, $received);
    }

    /**
     * Handle incoming webhook
     */
    public function handle(string $payload, string $signature): array
    {
        // Verify signature (required in production)
        if ($this->secret && !$this->verifySignature($payload, $signature)) {
            error_log("[Webhook] Invalid signature");
            http_response_code(401);
            return ['error' => 'Invalid signature'];
        }

        // Parse event
        $event = json_decode($payload, true);
        if (!$event) {
            http_response_code(400);
            return ['error' => 'Invalid JSON'];
        }

        // Production deliveries name the event in "event"; older payloads use "type".
        $eventType = $event['event'] ?? $event['type'] ?? 'unknown';
        $deliveryId = $event['delivery_id'] ?? 'unknown';

        error_log("[Webhook] Received: {$eventType} ({$deliveryId})");

        // Handle different event types
        switch ($eventType) {
            case 'reevit.webhook.test':
                error_log("[Webhook] Test event: " . ($event['message'] ?? ''));
                break;

            case 'payment.updated':
                // A terminal outcome arrives as payment.updated with the result in
                // data.status. There is no payment.succeeded / payment.failed event.
                $status = $event['data']['status'] ?? null;
                if ($status === 'succeeded') {
                    $this->handlePaymentSucceeded($event['data']);
                } elseif ($status === 'failed') {
                    $this->handlePaymentFailed($event['data']);
                }
                break;

            case 'refund.succeeded':
                $this->handlePaymentRefunded($event['data'] ?? []);
                break;

            default:
                error_log("[Webhook] Unhandled event: {$eventType}");
        }

        return ['received' => true];
    }

    protected function handlePaymentSucceeded(array $data): void
    {
        $orderId = $data['metadata']['order_id'] ?? 'unknown';
        error_log("[Webhook] ✅ Payment succeeded: {$data['id']} for order {$orderId}");

        // TODO: Implement your business logic
        // - Update order status to "paid"
        // - Send confirmation email
        // - Trigger fulfillment
    }

    protected function handlePaymentFailed(array $data): void
    {
        error_log("[Webhook] ❌ Payment failed: {$data['id']}");

        // TODO: Implement your business logic
        // - Update order status
        // - Notify customer
    }

    protected function handlePaymentRefunded(array $data): void
    {
        $orderId = $data['metadata']['order_id'] ?? 'unknown';
        $data['payment_id'] ??= 'unknown';
        error_log("[Webhook] 💰 Refund succeeded: {$data['id']} for payment {$data['payment_id']} (order {$orderId})");

        // TODO: Implement your business logic
        // - Update order status
        // - Restore inventory
    }
}
