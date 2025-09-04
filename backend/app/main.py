from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .models import create_db_and_tables
from .routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    yield
    # Shutdown

app = FastAPI(
    title="Routine Roulette API",
    description="Backend API for Routine Roulette PWA",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
        "http://localhost:4173",  # Vite preview
        "http://127.0.0.1:4173",
        "https://*.netlify.app",  # Production
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Routine Roulette API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
