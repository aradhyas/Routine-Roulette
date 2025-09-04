from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from backend.app.models import create_db_and_tables
from backend.app.routes import router

# Create FastAPI app
app = FastAPI(
    title="Routine Roulette API",
    description="Backend API for Routine Roulette PWA",
    version="1.0.0"
)

# Initialize database
create_db_and_tables()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
        "http://localhost:4173",  # Vite preview
        "http://127.0.0.1:4173",
        "https://*.netlify.app",  # Production
        "https://*.vercel.app",   # Vercel production
        "*"  # Allow all origins for Vercel deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Routine Roulette API is running on Vercel!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Vercel handler using Mangum
handler = Mangum(app)
