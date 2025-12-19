import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

# Environment
ENV = os.getenv("ENV", "DEVELOPMENT")
DEBUG = ENV == "DEVELOPMENT"

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo.db")

# JWT
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production-minimum-32-chars!!")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# CORS
CORS_ORIGINS_STR = os.getenv("CORS_ORIGINS", '["http://localhost:3000","http://127.0.0.1:8000"]')
try:
    import json
    CORS_ORIGINS = json.loads(CORS_ORIGINS_STR)
except:
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:8000"]

# Server
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Security
BCRYPT_LOG_ROUNDS = 12

