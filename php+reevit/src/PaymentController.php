<?php

namespace App;

use Reevit\Reevit;

class PaymentController
{
    private Reevit $client;

    public function __construct(string $apiKey)
    {
        $this->client = new Reevit($apiKey);
    }

    /**
     * Create a payment intent
     */
    public function create(array $data): array
    {
        // Validate required fields
        if (!isset($data['amount']) || $data['amount'] <= 0) {
            throw new \InvalidArgumentException('Amount is required and must be positive');
        }

        // Create payment via Reevit SDK
        $payment = $this->client->payments->createIntent([
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'GHS',
            'method' => $data['method'] ?? 'card',
            'country' => $data['country'] ?? 'GH',
            'customer_id' => $data['customer_id'] ?? null,
            'metadata' => $data['metadata'] ?? [],
        ]);

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
