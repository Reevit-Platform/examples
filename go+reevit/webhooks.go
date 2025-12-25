package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

// WebhookPayload represents incoming webhook event
type WebhookPayload struct {
	ID        string          `json:"id"`
	Type      string          `json:"type"`
	OrgID     string          `json:"org_id"`
	CreatedAt string          `json:"created_at"`
	Data      json.RawMessage `json:"data,omitempty"`
	Message   string          `json:"message,omitempty"`
}

// PaymentEventData represents payment event data
type PaymentEventData struct {
	ID         string            `json:"id"`
	Status     string            `json:"status"`
	Amount     int64             `json:"amount"`
	Currency   string            `json:"currency"`
	Provider   string            `json:"provider"`
	CustomerID string            `json:"customer_id,omitempty"`
	Metadata   map[string]string `json:"metadata,omitempty"`
}

// VerifySignature verifies webhook signature (HMAC-SHA256)
func VerifySignature(payload []byte, signature, secret string) bool {
	if !strings.HasPrefix(signature, "sha256=") {
		return false
	}

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(payload)
	expected := hex.EncodeToString(mac.Sum(nil))
	received := signature[7:] // Remove "sha256=" prefix

	return hmac.Equal([]byte(received), []byte(expected))
}

// HandleWebhook processes incoming webhooks from Reevit
func (s *Server) HandleWebhook(w http.ResponseWriter, r *http.Request) {
	// Read raw body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, `{"error": "Failed to read body"}`, http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Verify signature (required in production)
	signature := r.Header.Get("X-Reevit-Signature")
	secret := os.Getenv("REEVIT_WEBHOOK_SECRET")

	if secret != "" && !VerifySignature(body, signature, secret) {
		log.Println("[Webhook] Invalid signature")
		http.Error(w, `{"error": "Invalid signature"}`, http.StatusUnauthorized)
		return
	}

	// Parse event
	var event WebhookPayload
	if err := json.Unmarshal(body, &event); err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	log.Printf("[Webhook] Received: %s (%s)", event.Type, event.ID)

	// Handle different event types
	switch event.Type {
	case "reevit.webhook.test":
		log.Printf("[Webhook] Test event: %s", event.Message)

	case "payment.succeeded":
		var data PaymentEventData
		if err := json.Unmarshal(event.Data, &data); err == nil {
			handlePaymentSucceeded(data)
		}

	case "payment.failed":
		var data PaymentEventData
		if err := json.Unmarshal(event.Data, &data); err == nil {
			handlePaymentFailed(data)
		}

	case "payment.refunded":
		var data PaymentEventData
		if err := json.Unmarshal(event.Data, &data); err == nil {
			handlePaymentRefunded(data)
		}

	default:
		log.Printf("[Webhook] Unhandled event: %s", event.Type)
	}

	// Acknowledge receipt
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"received": true})
}

func handlePaymentSucceeded(data PaymentEventData) {
	orderID := data.Metadata["order_id"]
	log.Printf("[Webhook] ✅ Payment succeeded: %s for order %s", data.ID, orderID)

	// TODO: Implement your business logic
	// - Update order status to "paid"
	// - Send confirmation email
	// - Trigger fulfillment
}

func handlePaymentFailed(data PaymentEventData) {
	log.Printf("[Webhook] ❌ Payment failed: %s", data.ID)

	// TODO: Implement your business logic
	// - Update order status
	// - Notify customer
}

func handlePaymentRefunded(data PaymentEventData) {
	orderID := data.Metadata["order_id"]
	log.Printf("[Webhook] 💰 Payment refunded: %s for order %s", data.ID, orderID)

	// TODO: Implement your business logic
	// - Update order status
	// - Restore inventory
}
