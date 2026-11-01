package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

const testWebhookSecret = "whsec_test"

func sign(body string) string {
	mac := hmac.New(sha256.New, []byte(testWebhookSecret))
	mac.Write([]byte(body))
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}

// deliver posts a body to HandleWebhook and returns the status plus how many
// times each payment hook ran.
func deliver(t *testing.T, body, signature string) (code, succeeded, failed, refunded int) {
	t.Helper()
	t.Setenv("REEVIT_WEBHOOK_SECRET", testWebhookSecret)
	prevS, prevF, prevR := onPaymentSucceeded, onPaymentFailed, onPaymentRefunded
	t.Cleanup(func() { onPaymentSucceeded, onPaymentFailed, onPaymentRefunded = prevS, prevF, prevR })
	onPaymentSucceeded = func(PaymentEventData) { succeeded++ }
	onPaymentFailed = func(PaymentEventData) { failed++ }
	onPaymentRefunded = func(PaymentEventData) { refunded++ }

	req := httptest.NewRequest(http.MethodPost, "/webhooks/reevit", strings.NewReader(body))
	req.Header.Set("X-Reevit-Signature", signature)
	rec := httptest.NewRecorder()
	(&Server{}).HandleWebhook(rec, req)
	return rec.Code, succeeded, failed, refunded
}

func productionBody(status string) string {
	return `{"event":"payment.updated","org_id":"org_123","timestamp":"2026-02-10T10:05:00Z",` +
		`"api_version":"2026-03-05","delivery_id":"3f2a1c9e","attempt":1,"mode":"live",` +
		`"data":{"id":"pay_xyz789","amount":5000,"currency":"GHS","status":"` + status + `",` +
		`"provider":"paystack","customer_id":"cust_456","metadata":{"order_id":"12345"}}}`
}

func TestWebhookProductionSucceeded(t *testing.T) {
	body := productionBody("succeeded")
	code, s, f, r := deliver(t, body, sign(body))
	if code != http.StatusOK || s != 1 || f != 0 || r != 0 {
		t.Fatalf("code=%d succeeded=%d failed=%d refunded=%d", code, s, f, r)
	}
}

func TestWebhookProductionFailed(t *testing.T) {
	body := productionBody("failed")
	code, s, f, r := deliver(t, body, sign(body))
	if code != http.StatusOK || s != 0 || f != 1 || r != 0 {
		t.Fatalf("code=%d succeeded=%d failed=%d refunded=%d", code, s, f, r)
	}
}

func TestWebhookLegacyTypeEnvelope(t *testing.T) {
	body := `{"id":"evt_1","type":"payment.updated","data":{"id":"pay_1","status":"succeeded","amount":100,"currency":"GHS"}}`
	code, s, _, _ := deliver(t, body, sign(body))
	if code != http.StatusOK || s != 1 {
		t.Fatalf("code=%d succeeded=%d", code, s)
	}
}

func TestWebhookTestEvent(t *testing.T) {
	body := `{"event":"reevit.webhook.test","message":"hello"}`
	code, s, f, r := deliver(t, body, sign(body))
	if code != http.StatusOK || s+f+r != 0 {
		t.Fatalf("code=%d succeeded=%d failed=%d refunded=%d", code, s, f, r)
	}
}

func TestWebhookRefundSucceeded(t *testing.T) {
	body := `{"event":"refund.succeeded","data":{"id":"ref_1","payment_id":"pay_1","status":"succeeded","amount":100,"currency":"GHS"}}`
	code, _, _, r := deliver(t, body, sign(body))
	if code != http.StatusOK || r != 1 {
		t.Fatalf("code=%d refunded=%d", code, r)
	}
}

func TestWebhookBadSignature(t *testing.T) {
	body := productionBody("succeeded")
	code, s, f, r := deliver(t, body, "sha256=deadbeef")
	if code != http.StatusUnauthorized || s+f+r != 0 {
		t.Fatalf("code=%d succeeded=%d failed=%d refunded=%d", code, s, f, r)
	}
}
