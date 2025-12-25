# Go + Reevit Example

A Go server demonstrating the Reevit Go SDK for payment processing and webhook handling.

## Features

- 💳 **Payment API** - Create, get, list payments
- 🔒 **Webhook Handler** - With HMAC signature verification
- 🚀 **Simple Setup** - Single binary, no dependencies

## Quick Start

```bash
# Set environment variables
export REEVIT_API_KEY=pk_test_xxx
export REEVIT_WEBHOOK_SECRET=whsec_xxx

# Run the server
go run .
```

Server runs at `http://localhost:8081`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Create a payment |
| GET | `/api/payments/{id}` | Get payment by ID |
| GET | `/api/payments` | List all payments |
| POST | `/webhooks/reevit` | Receive webhooks |

## Create Payment Example

```bash
curl -X POST http://localhost:8081/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "GHS",
    "method": "momo",
    "country": "GH",
    "metadata": {"order_id": "123"}
  }'
```

## Webhook Events

The server handles:
- `payment.succeeded` - Payment completed
- `payment.failed` - Payment failed
- `payment.refunded` - Payment refunded

## Learn More

- [Reevit Go SDK](../../sdks/go/README.md)
- [Reevit Documentation](https://docs.reevit.io)
