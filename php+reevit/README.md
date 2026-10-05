# PHP + Reevit Example

A PHP server demonstrating the Reevit PHP SDK for payment processing and webhook handling.

## Features

- 💳 **Payment API** - Create, get, list payments
- 🔒 **Webhook Handler** - With HMAC signature verification
- 🐘 **PHP 8.1+** - Modern PHP syntax

## Quick Start

```bash
# Install dependencies
composer install

# Set environment variables
export REEVIT_API_KEY=pfk_test_xxx
export REEVIT_ORG_ID=org_xxx
export REEVIT_WEBHOOK_SECRET=whsec_xxx

# Run the server
php -S localhost:8083 public/index.php
```

Server runs at `http://localhost:8083`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Create a payment |
| GET | `/api/payments/{id}` | Get payment by ID |
| GET | `/api/payments` | List all payments |
| POST | `/webhooks/reevit` | Receive webhooks |

## Create Payment Example

Use one `Idempotency-Key` per logical order. Reuse it with the same payload on retries; use a new key for a new order. The examples forward that key to Reevit. Amounts use the currency's smallest unit: `5000` GHS means GHS 50.00.


```bash
curl -X POST http://localhost:8083/api/payments \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: checkout:order_123" \
  -d '{
    "amount": 5000,
    "currency": "GHS",
    "method": "mobile_money",
    "country": "GH",
    "metadata": {"order_id": "123"}
  }'
```

## Project Structure

```
php+reevit/
├── composer.json
├── public/
│   └── index.php         # Router
└── src/
    ├── PaymentController.php
    └── WebhookController.php
```

## Learn More

- [Reevit PHP SDK](../../sdks/php/README.md)
- [Reevit Documentation](https://docs.reevit.io)

## Verify the checkout contract

```bash
composer validate --no-check-publish
php tests/checkout.php
```
