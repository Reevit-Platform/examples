# PHP + Reevit Example

A PHP server demonstrating the Reevit PHP SDK for payment processing and webhook handling.

## Features

- 💳 **Payment API** - Create, get, list payments
- 🔒 **Webhook Handler** - With HMAC signature verification
- 🐘 **PHP 8+** - Modern PHP syntax

## Quick Start

```bash
# Install dependencies
composer install

# Set environment variables
export REEVIT_API_KEY=pfk_test_xxx
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

```bash
curl -X POST http://localhost:8083/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "GHS",
    "method": "momo",
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
