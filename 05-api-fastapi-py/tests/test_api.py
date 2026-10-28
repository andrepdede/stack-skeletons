from fastapi.testclient import TestClient
from app.main import app

c = TestClient(app)
good = {"name": "Maria Souza", "company": "Acme", "email": "m@acme.test", "plan": "Pro"}


def test_create_and_get():
    r = c.post("/leads", json=good)
    assert r.status_code == 201
    assert c.get(f"/leads/{r.json()['id']}").json()["email"] == "m@acme.test"


def test_validation_and_404():
    assert c.post("/leads", json={**good, "email": "bad"}).status_code == 422
    assert c.post("/leads", json={**good, "plan": "Gold"}).status_code == 422
    assert c.get("/leads/999").status_code == 404
