from fastapi import FastAPI
from app.routers import auth, items
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Origini consentite (React in locale)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # consente solo queste origini
    allow_credentials=True,
    allow_methods=["*"],                # consente tutti i metodi (GET, POST, ecc.)
    allow_headers=["*"],                # consente tutti gli header (Authorization, Content-Type, ecc.)
)

app = FastAPI()
app.include_router(auth.router)
app.include_router(items.router)
