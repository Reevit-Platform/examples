from pydantic import BaseModel
from typing import Optional, Dict


class CreatePaymentRequest(BaseModel):
    amount: int
    currency: str = "GHS"
    method: str = "card"
    country: str = "GH"
    customer_id: Optional[str] = None
    reference: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None


class PaymentResponse(BaseModel):
    id: str
    status: str
    amount: int
    currency: str
    provider: Optional[str] = None
    customer_id: Optional[str] = None
    reference: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None


class WebhookEvent(BaseModel):
    event: Optional[str] = None
    type: Optional[str] = None  # legacy envelope (`reevit listen` fallback)
    delivery_id: Optional[str] = None
    org_id: Optional[str] = None
    mode: Optional[str] = None
    timestamp: Optional[str] = None
    data: Optional[Dict] = None
    message: Optional[str] = None

    def name(self) -> Optional[str]:
        return self.event or self.type


class PaymentEventData(BaseModel):
    id: str
    payment_id: Optional[str] = None
    status: str
    amount: int
    currency: str
    provider: Optional[str] = None
    customer_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
