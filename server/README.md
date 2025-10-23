Run the API locally

1. Create server/.env from server/.env.example and fill keys

2. Install deps and run
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Endpoints
- GET /citydata
- POST /simulate
- POST /compare
- POST /chat
