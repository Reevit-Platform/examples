package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func main() {
	// Load environment variables
	apiKey := os.Getenv("REEVIT_API_KEY")
	if apiKey == "" {
		apiKey = "pk_test_demo" // Default for development
	}
	orgID := os.Getenv("REEVIT_ORG_ID")
	if orgID == "" {
		orgID = "org_demo" // Default for development
	}

	// Initialize server
	server := NewServer(apiKey, orgID)

	// Payment routes
	http.HandleFunc("POST /api/payments", server.CreatePayment)
	http.HandleFunc("GET /api/payments/{id}", server.GetPayment)
	http.HandleFunc("GET /api/payments", server.ListPayments)

	// Webhook route
	http.HandleFunc("POST /webhooks/reevit", server.HandleWebhook)

	// Health check
	http.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("🚀 Go + Reevit server listening on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
