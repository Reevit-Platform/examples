import os
import logging
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv

from models import CreatePaymentRequest, PaymentResponse
from webhooks import router as webhook_router

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Python + Reevit Example",
    description="A FastAPI server demonstrating the Reevit Python SDK",
    version="0.1.0"
)

# Include webhook router
app.include_router(webhook_router)

# Get API key
api_key = os.getenv("REEVIT_API_KEY", "pk_test_demo")

# Initialize Reevit client
try:
    from reevit import Reevit
    client = Reevit(api_key=api_key)
except ImportError:
    logger.warning("Reevit SDK not installed. Using mock client.")
    client = None


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/api/payments", response_model=PaymentResponse)
async def create_payment(request: CreatePaymentRequest):
    """Create a new payment intent."""
    if not client:
        raise HTTPException(status_code=503, detail="Reevit SDK not available")
    
    try:
        payment = client.payments.create_intent({
            "amount": request.amount,
            "currency": request.currency,
            "method": request.method,
            "country": request.country,
            "customer_id": request.customer_id,
            "metadata": request.metadata or {}
        })
        
        logger.info(f"[Payment] Created: {payment['id']} (Status: {payment['status']})")
        
        return PaymentResponse(
            id=payment["id"],
            status=payment["status"],
            amount=payment["amount"],
            currency=payment["currency"],
            provider=payment.get("provider"),
            customer_id=payment.get("customer_id"),
            metadata=payment.get("metadata")
        )
    except Exception as e:
        logger.error(f"[Payment] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/payments/{payment_id}", response_model=PaymentResponse)
async def get_payment(payment_id: str):
    """Get payment by ID."""
    if not client:
        raise HTTPException(status_code=503, detail="Reevit SDK not available")
    
    try:
        payment = client.payments.get(payment_id)
        return PaymentResponse(
            id=payment["id"],
            status=payment["status"],
            amount=payment["amount"],
            currency=payment["currency"],
            provider=payment.get("provider"),
            customer_id=payment.get("customer_id"),
            metadata=payment.get("metadata")
        )
    except Exception as e:
        logger.error(f"[Payment] Error fetching {payment_id}: {e}")
        raise HTTPException(status_code=404, detail="Payment not found")


@app.get("/api/payments")
async def list_payments():
    """List all payments."""
    if not client:
        raise HTTPException(status_code=503, detail="Reevit SDK not available")
    
    try:
        payments = client.payments.list()
        return payments
    except Exception as e:
        logger.error(f"[Payment] Error listing: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8082"))
    logger.info(f"🚀 Python + Reevit server listening on http://localhost:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
