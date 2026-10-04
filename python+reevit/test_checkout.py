import json
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from fastapi.testclient import TestClient
from reevit import Reevit

import main


class CheckoutContractTest(unittest.TestCase):
    def setUp(self):
        self.seen = []
        seen = self.seen

        class Canary(BaseHTTPRequestHandler):
            def do_POST(self):
                body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
                seen.append((self.path, self.headers.get("Idempotency-Key"), body))
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "id": "pay_example", "status": "requires_action",
                    "amount": body["amount"], "currency": body["currency"],
                }).encode())

            def log_message(self, *_):
                pass

        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Canary)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        main.client = Reevit(api_key="pfk_test_example", org_id="org_example",
                             base_url=f"http://127.0.0.1:{self.server.server_port}")
        self.api = TestClient(main.app)

    def tearDown(self):
        self.api.close()
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()

    def test_same_order_preserves_key_and_payload_through_released_sdk(self):
        for _ in range(2):
            response = self.api.post("/api/payments", json={"amount": 5000, "currency": "GHS"},
                                     headers={"Idempotency-Key": "checkout:order_123"})
            self.assertEqual(response.status_code, 200, response.text)
            self.assertEqual(response.json()["id"], "pay_example")
        self.assertEqual(len(self.seen), 2)
        self.assertEqual(self.seen[0], self.seen[1])
        path, key, body = self.seen[0]
        self.assertEqual(path, "/v1/payments/intents")
        self.assertEqual(key, "checkout:order_123")
        self.assertEqual(body["reference"], key)

    def test_missing_key_returns_400_without_creating_an_intent(self):
        response = self.api.post("/api/payments", json={"amount": 5000})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.seen, [])


if __name__ == "__main__":
    unittest.main()
