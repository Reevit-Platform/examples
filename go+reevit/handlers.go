package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	reevit "github.com/Reevit-Platform/go-sdk"
)

// Server handles HTTP requests
type Server struct {
	client *reevit.Client
}

// NewServer creates a new server instance
func NewServer(apiKey, orgID string) *Server {
	return &Server{
		client: reevit.NewClient(apiKey, orgID),
	}
}

// CreatePaymentRequest represents incoming payment request
type CreatePaymentRequest struct {
	Amount     int64             `json:"amount"`
	Currency   string            `json:"currency"`
	Method     string            `json:"method"`
	Country    string            `json:"country"`
	CustomerID string            `json:"customer_id,omitempty"`
	Metadata   map[string]string `json:"metadata,omitempty"`
}

// CreatePayment handles POST /api/payments
func (s *Server) CreatePayment(w http.ResponseWriter, r *http.Request) {
	var req CreatePaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Amount <= 0 {
		http.Error(w, `{"error": "Amount is required and must be positive"}`, http.StatusBadRequest)
		return
	}
	if req.Currency == "" {
		req.Currency = "GHS"
	}
	if req.Method == "" {
		req.Method = "card"
	}
	if req.Country == "" {
		req.Country = "GH"
	}

	// Convert metadata to interface map
	metadata := make(map[string]interface{})
	for k, v := range req.Metadata {
		metadata[k] = v
	}

	// Create payment intent via Reevit SDK
	payment, err := s.client.Payments.CreateIntent(context.Background(), &reevit.PaymentIntentRequest{
		Amount:     req.Amount,
		Currency:   req.Currency,
		Method:     req.Method,
		Country:    req.Country,
		CustomerID: req.CustomerID,
		Metadata:   metadata,
	})
	if err != nil {
		log.Printf("[Payment] Error creating payment: %v", err)
		http.Error(w, `{"error": "Failed to create payment"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("[Payment] Created: %s (Status: %s)", payment.ID, payment.Status)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(payment)
}

// GetPayment handles GET /api/payments/{id}
func (s *Server) GetPayment(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, `{"error": "Payment ID is required"}`, http.StatusBadRequest)
		return
	}

	payment, err := s.client.Payments.Get(context.Background(), id)
	if err != nil {
		log.Printf("[Payment] Error fetching payment %s: %v", id, err)
		http.Error(w, `{"error": "Payment not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(payment)
}

// ListPayments handles GET /api/payments
func (s *Server) ListPayments(w http.ResponseWriter, r *http.Request) {
	payments, err := s.client.Payments.List(context.Background(), 100, 0)
	if err != nil {
		log.Printf("[Payment] Error listing payments: %v", err)
		http.Error(w, `{"error": "Failed to list payments"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(payments)
}
