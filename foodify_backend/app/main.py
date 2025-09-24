from fastapi import FastAPI
from app.routers import auth, items, token_check
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS configurato correttamente
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Router inclusi dopo il middleware
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(token_check.router)
