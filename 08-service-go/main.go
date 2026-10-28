package main

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"sync"
)

type Lead struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Company string `json:"company"`
	Email   string `json:"email"`
	Plan    string `json:"plan"`
}

var emailRe = regexp.MustCompile(`^[^@\s]+@[^@\s]+\.[^@\s]+$`)

type Server struct {
	mu    sync.Mutex
	leads map[int]Lead
}

func NewServer() *Server { return &Server{leads: map[int]Lead{}} }

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /leads", s.create)
	mux.HandleFunc("GET /leads/{id}", s.get)
	return mux
}

func (s *Server) create(w http.ResponseWriter, r *http.Request) {
	var l Lead
	if err := json.NewDecoder(r.Body).Decode(&l); err != nil || len(l.Name) < 2 || !emailRe.MatchString(l.Email) || (l.Plan != "Starter" && l.Plan != "Pro") {
		http.Error(w, "invalid lead", http.StatusUnprocessableEntity)
		return
	}
	s.mu.Lock()
	l.ID = len(s.leads) + 1
	s.leads[l.ID] = l
	s.mu.Unlock()
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(l)
}

func (s *Server) get(w http.ResponseWriter, r *http.Request) {
	var id int
	if _, err := fmtSscan(r.PathValue("id"), &id); err != nil {
		http.NotFound(w, r)
		return
	}
	s.mu.Lock()
	l, ok := s.leads[id]
	s.mu.Unlock()
	if !ok {
		http.NotFound(w, r)
		return
	}
	json.NewEncoder(w).Encode(l)
}

func main() {
	log.Println("listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", NewServer().Routes()))
}
