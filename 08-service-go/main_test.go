package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCreateAndGet(t *testing.T) {
	h := NewServer().Routes()
	body := `{"name":"Maria Souza","company":"Acme","email":"m@acme.test","plan":"Pro"}`
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("POST", "/leads", strings.NewReader(body)))
	if rec.Code != http.StatusCreated {
		t.Fatalf("create: got %d", rec.Code)
	}
	rec = httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("GET", "/leads/1", nil))
	if rec.Code != 200 || !strings.Contains(rec.Body.String(), "m@acme.test") {
		t.Fatalf("get: %d %s", rec.Code, rec.Body.String())
	}
}

func TestValidation(t *testing.T) {
	h := NewServer().Routes()
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("POST", "/leads", strings.NewReader(`{"name":"M","email":"bad","plan":"Gold"}`)))
	if rec.Code != http.StatusUnprocessableEntity {
		t.Fatalf("got %d", rec.Code)
	}
}
