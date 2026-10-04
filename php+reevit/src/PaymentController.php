<?php

namespace App;

use Reevit\Reevit;

class PaymentController
{
    private Reevit $client;

    public function __construct(string $apiKey)
    {
        $this->client = new Reevit($apiKey, getenv('REEVIT_ORG_ID') ?: null, getenv('REEVIT_BASE_URL') ?: null);
    }

    /**
     * Create a payment intent
     */
    public function create(array $data, string $idempotencyKey): array
    {
        $idempotencyKey = trim($idempotencyKey);
        if ($idempotencyKey === '') {
            throw new \InvalidArgumentException('Idempotency-Key header is required');
        }
        // Validate required fields
        if (!isset($data['amount']) || $data['amount'] <= 0) {
            throw new \InvalidArgumentException('Amount is required and must be positive');
        }

        // Generate reference if not provided
        $reference = $data['reference'] ?? $idempotencyKey;

        // Ensure metadata includes required fields for webhook routing
        $metadata = $data['metadata'] ?? [];
        $metadata['payment_id'] = $reference;
        $metadata['org_id'] = getenv('REEVIT_ORG_ID') ?: 'your-org-id';

        // Create payment via Reevit SDK
        $payment = $this->client->payments->createIntent([
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'GHS',
            'method' => $data['method'] ?? 'card',
            'country' => $data['country'] ?? 'GH',
            'customer_id' => $data['customer_id'] ?? null,
            'reference' => $reference,
            'metadata' => $metadata,
        ], $idempotencyKey);

        error_log("[Payment] Created: {$payment['id']} (Status: {$payment['status']})");

        return $payment;
    }

    /**
     * Get payment by ID
     */
    public function get(string $paymentId): array
    {
        return $this->client->payments->get($paymentId);
    }

    /**
     * List all payments
     */
    public function list(): array
    {
        return $this->client->payments->list();
    }
}
