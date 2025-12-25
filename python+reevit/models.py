from pydantic import BaseModel
from typing import Optional, Dict


class CreatePaymentRequest(BaseModel):
    amount: int
    currency: str = "GHS"
    method: str = "card"
    country: str = "GH"
    customer_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None


class PaymentResponse(BaseModel):
    id: str
    status: str
    amount: int
    currency: str
    provider: Optional[str] = None
    customer_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None


class WebhookEvent(BaseModel):
    id: str
    type: str
    org_id: Optional[str] = None
    created_at: Optional[str] = None
    data: Optional[Dict] = None
    message: Optional[str] = None


class PaymentEventData(BaseModel):
    id: str
    status: str
    amount: int
    currency: str
    provider: Optional[str] = None
    customer_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
