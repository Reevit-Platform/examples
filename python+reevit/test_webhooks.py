import hashlib
import hmac
import json
import unittest
from unittest import mock

from fastapi.testclient import TestClient

import main
import webhooks

SECRET = "whsec_test"


def signed(body: dict):
    raw = json.dumps(body).encode()
    sig = "sha256=" + hmac.new(SECRET.encode(), raw, hashlib.sha256).hexdigest()
    return raw, {"X-Reevit-Signature": sig, "Content-Type": "application/json"}


def production(status: str) -> dict:
    return {
        "event": "payment.updated", "org_id": "org_123", "timestamp": "2026-02-10T10:05:00Z",
        "api_version": "2026-03-05", "delivery_id": "3f2a1c9e", "attempt": 1, "mode": "live",
        "data": {"id": "pay_xyz789", "amount": 5000, "currency": "GHS", "status": status,
                 "provider": "paystack", "customer_id": "cust_456", "metadata": {"order_id": "12345"}},
    }


class WebhookContractTest(unittest.TestCase):
    def setUp(self):
        env = mock.patch.dict("os.environ", {"REEVIT_WEBHOOK_SECRET": SECRET})
        env.start()
        self.addCleanup(env.stop)
        self.client = TestClient(main.app)
        patches = {n: mock.patch.object(webhooks, n) for n in
                   ("handle_payment_succeeded", "handle_payment_failed", "handle_payment_refunded")}
        self.hooks = {n: p.start() for n, p in patches.items()}
        for p in patches.values():
            self.addCleanup(p.stop)

    def post(self, body: dict):
        raw, headers = signed(body)
        return self.client.post("/webhooks/reevit", content=raw, headers=headers)

    def test_production_succeeded(self):
        self.assertEqual(self.post(production("succeeded")).status_code, 200)
        self.hooks["handle_payment_succeeded"].assert_called_once()
        self.hooks["handle_payment_failed"].assert_not_called()

    def test_production_failed(self):
        self.assertEqual(self.post(production("failed")).status_code, 200)
        self.hooks["handle_payment_failed"].assert_called_once()
        self.hooks["handle_payment_succeeded"].assert_not_called()

    def test_legacy_type_envelope(self):
        body = {"id": "evt_1", "type": "payment.updated",
                "data": {"id": "pay_1", "status": "succeeded", "amount": 100, "currency": "GHS"}}
        self.assertEqual(self.post(body).status_code, 200)
        self.hooks["handle_payment_succeeded"].assert_called_once()

    def test_test_event(self):
        res = self.post({"event": "reevit.webhook.test", "message": "hello"})
        self.assertEqual(res.status_code, 200)
        for hook in self.hooks.values():
            hook.assert_not_called()

    def test_refund_succeeded(self):
        body = {"event": "refund.succeeded", "data": {
            "id": "ref_1", "payment_id": "pay_1", "status": "succeeded", "amount": 100, "currency": "GHS"}}
        self.assertEqual(self.post(body).status_code, 200)
        self.hooks["handle_payment_refunded"].assert_called_once()

    def test_bad_signature(self):
        raw, _ = signed(production("succeeded"))
        res = self.client.post("/webhooks/reevit", content=raw,
                               headers={"X-Reevit-Signature": "sha256=deadbeef"})
        self.assertEqual(res.status_code, 401)
        self.hooks["handle_payment_succeeded"].assert_not_called()


if __name__ == "__main__":
    unittest.main()
