from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import time

from app.database import engine, Base, get_db
from app.models import User, Task
from app.schemas import UserRegister, UserLogin, TokenResponse
from app.auth import register_user, login_user
from app.tasks import router as tasks_router
from app.config import CORS_ORIGINS, DEBUG
from app.logging import logger

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multi-User To-Do List API",
    description="A stateless, cloud-ready REST API for managing tasks across multiple users",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all HTTP requests."""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.2f}s"
    )
    return response


# Include routers
app.include_router(tasks_router)


@app.get("/", tags=["health"])
async def root():
    """Health check endpoint."""
    return {"message": "Multi-User To-Do List API is running"}


@app.post("/register", response_model=TokenResponse, tags=["auth"])
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user with email and password."""
    return await register_user(user_data, db)


@app.post("/login", response_model=TokenResponse, tags=["auth"])
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password."""
    return await login_user(user_data, db)


@app.get("/health", tags=["health"])
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "service": "Multi-User To-Do List API",
        "version": "1.0.0",
        "environment": "development" if DEBUG else "production",
    }

