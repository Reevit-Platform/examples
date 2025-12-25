import os
import hmac
import hashlib
import logging
from fastapi import APIRouter, Request, HTTPException

from models import WebhookEvent, PaymentEventData

logger = logging.getLogger(__name__)

router = APIRouter()


def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    """Verify webhook signature using HMAC-SHA256."""
    if not signature.startswith("sha256="):
        return False
    
    expected = hmac.new(
        secret.encode("utf-8"),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    received = signature[7:]  # Remove "sha256=" prefix
    return hmac.compare_digest(received, expected)


@router.post("/webhooks/reevit")
async def handle_webhook(request: Request):
    """Handle incoming webhooks from Reevit."""
    payload = await request.body()
    signature = request.headers.get("X-Reevit-Signature", "")
    secret = os.getenv("REEVIT_WEBHOOK_SECRET", "")
    
    # Verify signature (required in production)
    if secret and not verify_signature(payload, signature, secret):
        logger.warning("[Webhook] Invalid signature")
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Parse event
    event_data = await request.json()
    event = WebhookEvent(**event_data)
    
    logger.info(f"[Webhook] Received: {event.type} ({event.id})")
    
    # Handle different event types
    if event.type == "reevit.webhook.test":
        logger.info(f"[Webhook] Test event: {event.message}")
    
    elif event.type == "payment.succeeded":
        if event.data:
            data = PaymentEventData(**event.data)
            handle_payment_succeeded(data)
    
    elif event.type == "payment.failed":
        if event.data:
            data = PaymentEventData(**event.data)
            handle_payment_failed(data)
    
    elif event.type == "payment.refunded":
        if event.data:
            data = PaymentEventData(**event.data)
            handle_payment_refunded(data)
    
    else:
        logger.info(f"[Webhook] Unhandled event: {event.type}")
    
    return {"received": True}


def handle_payment_succeeded(data: PaymentEventData):
    """Handle successful payment."""
    order_id = data.metadata.get("order_id") if data.metadata else None
    logger.info(f"[Webhook] ✅ Payment succeeded: {data.id} for order {order_id}")
    
    # TODO: Implement your business logic
    # - Update order status to "paid"
    # - Send confirmation email
    # - Trigger fulfillment


def handle_payment_failed(data: PaymentEventData):
    """Handle failed payment."""
    logger.info(f"[Webhook] ❌ Payment failed: {data.id}")
    
    # TODO: Implement your business logic
    # - Update order status
    # - Notify customer


def handle_payment_refunded(data: PaymentEventData):
    """Handle refunded payment."""
    order_id = data.metadata.get("order_id") if data.metadata else None
    logger.info(f"[Webhook] 💰 Payment refunded: {data.id} for order {order_id}")
    
    # TODO: Implement your business logic
    # - Update order status
    # - Restore inventory
