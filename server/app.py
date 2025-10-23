import os
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_settings import BaseSettings
import httpx

# Gemini
import google.generativeai as genai

# Supabase (server-side service role)
from supabase import create_client, Client


class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    GEMINI_API_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings(_env_file=os.path.join(os.path.dirname(__file__), ".env")) if os.path.exists(
    os.path.join(os.path.dirname(__file__), ".env")
) else Settings()

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

# Configure Gemini
if not settings.GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing in server/.env")

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-exp")

app = FastAPI(title="SustainCity AI API")

# CORS for local Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Schemas ----------
class CityMetric(BaseModel):
    city: str
    co2: float
    aqi: float
    water_stress: float
    green_cover: float


class CityDataResponse(BaseModel):
    data: List[CityMetric]


class SimulateRequest(BaseModel):
    city: str
    industry: str
    co2: float
    water: float
    energy: float


class SimulateResponse(BaseModel):
    summary: str
    co2: float
    water: float
    energy: float


class CompareRequest(BaseModel):
    city: str
    industry_a: str
    industry_b: str


class CompareResponse(BaseModel):
    metrics: dict
    summary: str


class ChatMessage(BaseModel):
    role: str
    content: str
    created_at: Optional[str] = None


class ChatRequest(BaseModel):
    user_id: Optional[str]
    city: Optional[str]
    industry: Optional[str]
    message: str


class ChatResponse(BaseModel):
    messages: List[ChatMessage]


# ---------- Helpers ----------
async def gemini_one_liner(prompt: str) -> str:
    try:
        resp = model.generate_content(prompt)
        return resp.text.strip() if resp and getattr(resp, "text", None) else ""
    except Exception as e:
        return ""


async def gemini_chat(messages: List[dict]) -> str:
    try:
        chat = model.start_chat(history=[{"role": m["role"], "parts": [m["content"]]} for m in messages[:-1]])
        last_user = messages[-1]["content"]
        resp = chat.send_message(last_user)
        return resp.text.strip() if resp and getattr(resp, "text", None) else ""
    except Exception:
        return ""


# ---------- Endpoints ----------
@app.get("/citydata", response_model=CityDataResponse)
async def get_citydata():
    # Expect a table `citydata(city text, co2 float, aqi float, water_stress float, green_cover float)`
    result = supabase.table("citydata").select("city,co2,aqi,water_stress,green_cover").execute()
    rows = result.data or []

    # Generate one-line insights per city metric
    insights = {}
    for row in rows:
        city = row["city"]
        prompt = (
            f"Given {city} metrics: CO2 {row['co2']} kt, AQI {row['aqi']}, "
            f"Water stress {row['water_stress']}, Green cover {row['green_cover']}%. "
            f"Write one short human insight about the city's sustainability now."
        )
        insight = await gemini_one_liner(prompt)
        insights[city] = insight

    # Attach insights in response via Pydantic serialization
    data = [
        CityMetric(
            city=r["city"],
            co2=r["co2"],
            aqi=r["aqi"],
            water_stress=r["water_stress"],
            green_cover=r["green_cover"],
        )
        for r in rows
    ]
    # Include insights as header to keep response_model simple
    # But better: embed in payload
    return {"data": data, "insights": insights}  # type: ignore


@app.post("/simulate", response_model=SimulateResponse)
async def simulate(payload: SimulateRequest):
    # Stub: compute simple adjusted metrics
    co2 = max(0.0, payload.co2 * 0.92)
    water = max(0.0, payload.water * 0.95)
    energy = max(0.0, payload.energy * 0.9)

    prompt = (
        f"City {payload.city}, industry {payload.industry}: After simulation, CO2 {co2:.1f}, "
        f"water {water:.1f}, energy {energy:.1f}. Give one concise insight."
    )
    summary = await gemini_one_liner(prompt)

    return SimulateResponse(summary=summary, co2=co2, water=water, energy=energy)


@app.post("/compare", response_model=CompareResponse)
async def compare(payload: CompareRequest):
    # Fetch baseline metrics for industries in a city from Supabase table `industries`
    # Expected columns: city, name, co2, water, energy
    res = supabase.table("industries").select("name,co2,water,energy").eq("city", payload.city).in_("name", [payload.industry_a, payload.industry_b]).execute()
    items = res.data or []
    by_name = {i["name"]: i for i in items}
    a = by_name.get(payload.industry_a) or {"co2": 100.0, "water": 100.0, "energy": 100.0}
    b = by_name.get(payload.industry_b) or {"co2": 120.0, "water": 130.0, "energy": 140.0}

    metrics = {
        "a": {"name": payload.industry_a, **{k: float(a[k]) for k in ["co2", "water", "energy"]}},
        "b": {"name": payload.industry_b, **{k: float(b[k]) for k in ["co2", "water", "energy"]}},
    }

    prompt = (
        f"Compare in {payload.city}: {payload.industry_a} (CO2 {metrics['a']['co2']}, water {metrics['a']['water']}, energy {metrics['a']['energy']}) "
        f"vs {payload.industry_b} (CO2 {metrics['b']['co2']}, water {metrics['b']['water']}, energy {metrics['b']['energy']}). "
        f"Return one sentence insight."
    )
    summary = await gemini_one_liner(prompt)
    return {"metrics": metrics, "summary": summary}


@app.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    # Load last 5 interactions for context
    user_id = payload.user_id or "anon"
    hist_res = supabase.table("chat_history").select("role,content,created_at").eq("user_id", user_id).order("created_at", desc=True).limit(5).execute()
    history = list(reversed(hist_res.data or []))

    messages = [{"role": m["role"], "content": m["content"]} for m in history]
    messages.append({"role": "user", "content": payload.message})

    ai_text = await gemini_chat(messages)

    # Persist last 5: insert user and assistant messages
    supabase.table("chat_history").insert({"user_id": user_id, "role": "user", "content": payload.message}).execute()
    supabase.table("chat_history").insert({"user_id": user_id, "role": "assistant", "content": ai_text}).execute()

    # Return updated last 5
    hist_res2 = supabase.table("chat_history").select("role,content,created_at").eq("user_id", user_id).order("created_at", desc=True).limit(5).execute()
    msgs = [ChatMessage(**m) for m in reversed(hist_res2.data or [])]
    return {"messages": msgs}
