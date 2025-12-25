# Python + Reevit Example

A FastAPI server demonstrating the Reevit Python SDK for payment processing and webhook handling.

## Features

- 💳 **Payment API** - Create, get, list payments
- 🔒 **Webhook Handler** - With HMAC signature verification
- ⚡ **Async Support** - Built on FastAPI

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export REEVIT_API_KEY=pk_test_xxx
export REEVIT_WEBHOOK_SECRET=whsec_xxx

# Run the server
python main.py
```

Server runs at `http://localhost:8082`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Create a payment |
| GET | `/api/payments/{id}` | Get payment by ID |
| GET | `/api/payments` | List all payments |
| POST | `/webhooks/reevit` | Receive webhooks |

## Create Payment Example

```bash
curl -X POST http://localhost:8082/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "GHS",
    "method": "momo",
    "country": "GH",
    "metadata": {"order_id": "123"}
  }'
```

## API Docs

FastAPI auto-generates OpenAPI docs at:
- Swagger UI: `http://localhost:8082/docs`
- ReDoc: `http://localhost:8082/redoc`

## Learn More

- [Reevit Python SDK](../../sdks/python/README.md)
- [Reevit Documentation](https://docs.reevit.io)
