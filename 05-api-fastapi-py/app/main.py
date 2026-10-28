from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Leads API")
DB: dict[int, dict] = {}


class LeadIn(BaseModel):
    name: str = Field(min_length=2)
    company: str
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    plan: str = Field(pattern=r"^(Starter|Pro)$")


class LeadOut(LeadIn):
    id: int


@app.post("/leads", response_model=LeadOut, status_code=201)
def create_lead(lead: LeadIn):
    lid = len(DB) + 1
    DB[lid] = {"id": lid, **lead.model_dump()}
    return DB[lid]


@app.get("/leads/{lead_id}", response_model=LeadOut)
def get_lead(lead_id: int):
    if lead_id not in DB:
        raise HTTPException(404, "lead not found")
    return DB[lead_id]
