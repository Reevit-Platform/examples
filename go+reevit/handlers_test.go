package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	reevit "github.com/Reevit-Platform/go-sdk"
)

func TestCreatePaymentForwardsStableIdempotencyKey(t *testing.T) {
	var keys []string
	var bodies []map[string]any
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v1/payments/intents" {
			t.Errorf("unexpected SDK path: %s", r.URL.Path)
		}
		keys = append(keys, r.Header.Get("Idempotency-Key"))
		var body map[string]any
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Error(err)
		}
		bodies = append(bodies, body)
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"id":"pay_example","status":"requires_action","amount":5000,"currency":"GHS"}`))
	}))
	defer api.Close()
	server := &Server{client: reevit.NewClient("pfk_test_example", "org_example", reevit.WithBaseURL(api.URL)), orgID: "org_example"}
	for range 2 {
		req := httptest.NewRequest(http.MethodPost, "/api/payments", strings.NewReader(`{"amount":5000,"currency":"GHS"}`))
		req.Header.Set("Idempotency-Key", "checkout:order_123")
		response := httptest.NewRecorder()
		server.CreatePayment(response, req)
		if response.Code != http.StatusOK {
			t.Fatalf("create returned %d: %s", response.Code, response.Body.String())
		}
	}
	if len(keys) != 2 || keys[0] != "checkout:order_123" || keys[1] != keys[0] {
		t.Fatalf("unstable or missing forwarded keys: %v", keys)
	}
	first, _ := json.Marshal(bodies[0])
	retry, _ := json.Marshal(bodies[1])
	if string(first) != string(retry) || bodies[0]["reference"] != "checkout:order_123" {
		t.Fatalf("retry changed the intent body: %s / %s", first, retry)
	}
}

func TestCreatePaymentRequiresAnOrderKey(t *testing.T) {
	server := &Server{}
	response := httptest.NewRecorder()
	server.CreatePayment(response, httptest.NewRequest(http.MethodPost, "/api/payments", strings.NewReader(`{"amount":5000}`)))
	if response.Code != http.StatusBadRequest {
		t.Fatalf("missing key returned %d instead of 400", response.Code)
	}
}
