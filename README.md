# Multi-User Online To-Do List API

**Production-Grade REST API for Multi-User Task Management**

A stateless, cloud-ready FastAPI backend with JWT authentication, user isolation, and database-agnostic design. Ready for local development and cloud deployment.

---

## 🎯 Features

✅ **User Authentication**
- JWT-based stateless authentication
- Secure password hashing with bcrypt
- Token expiration support

✅ **User Isolation**
- Each user only sees their own tasks
- Authorization checks on all endpoints
- Unauthorized access logging

✅ **Database Flexibility**
- SQLite for local development
- PostgreSQL for production
- Zero code changes needed when switching

✅ **Cloud-Ready**
- Docker containerization
- Environment-based configuration
- Centralized logging
- CORS support
- Health check endpoint

✅ **Security**
- HTTP Bearer token authentication
- Protected endpoints
- Secure password storage
- Unauthorized access tracking

---

## 📋 Architecture Overview

### Authentication Flow
1. User registers → Password hashed with bcrypt → User stored
2. User logs in → Credentials verified → JWT token issued
3. Client sends token in `Authorization: Bearer <token>` header
4. API validates token, extracts `user_id`, ensures authorization

### User Isolation
- All tasks tied to `user_id` via foreign key
- GET /tasks filters by current user only
- PUT/DELETE verify task ownership before modification

### Database Design
```
Users
  ├── id (PK)
  ├── email (unique)
  └── password_hash

Tasks
  ├── id (PK)
  ├── title
  ├── description
  ├── completed
  ├── user_id (FK → Users.id)
  ├── created_at
  └── updated_at
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- pip

### 1. Local Development (SQLite)

**Clone and setup:**
```bash
cd "Online To-Do List (Multi-User)"
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
```

**Create .env file (already created):**
```
ENV=DEVELOPMENT
DATABASE_URL=sqlite:///./todo.db
JWT_SECRET_KEY=your-secret-key-change-this-in-production-minimum-32-chars!!
LOG_LEVEL=INFO
```

**Run the server:**
```bash
uvicorn app.main:app --reload
```

**Access API:**
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

---

## 📚 API Endpoints

### Authentication

**Register User**
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1
}
```

**Login User**
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1
}
```

### Tasks (Requires Authorization Header)

**Get All Tasks**
```http
GET /tasks
Authorization: Bearer YOUR_TOKEN_HERE

Response: 200
{
  "tasks": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "user_id": 1,
      "created_at": "2025-12-19T10:43:55",
      "updated_at": "2025-12-19T10:43:55"
    }
  ],
  "total": 1
}
```

**Create Task**
```http
POST /tasks
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}

Response: 201
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "user_id": 1,
  "created_at": "2025-12-19T10:43:55",
  "updated_at": "2025-12-19T10:43:55"
}
```

**Get Task by ID**
```http
GET /tasks/1
Authorization: Bearer YOUR_TOKEN_HERE

Response: 200
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "user_id": 1,
  "created_at": "2025-12-19T10:43:55",
  "updated_at": "2025-12-19T10:43:55"
}
```

**Update Task**
```http
PUT /tasks/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "completed": true
}

Response: 200
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "user_id": 1,
  "created_at": "2025-12-19T10:43:55",
  "updated_at": "2025-12-19T10:44:22"
}
```

**Delete Task**
```http
DELETE /tasks/1
Authorization: Bearer YOUR_TOKEN_HERE

Response: 204 No Content
```

---

## 🐳 Docker & Production Deployment

### Build Docker Image

```bash
docker build -t todo-api:latest .
```

### Run with SQLite (Development)

```bash
docker run -p 8000:8000 \
  -e ENV=DEVELOPMENT \
  -e DATABASE_URL=sqlite:///./todo.db \
  -e JWT_SECRET_KEY=your-secret-key \
  todo-api:latest
```

### Run with PostgreSQL (Production)

```bash
docker run -p 8000:8000 \
  -e ENV=PRODUCTION \
  -e DATABASE_URL=postgresql://user:password@postgres:5432/todo_db \
  -e JWT_SECRET_KEY=production-secret-key-32-chars-min \
  -e CORS_ORIGINS='["https://yourdomain.com"]' \
  todo-api:latest
```

### Docker Compose (Full Stack with PostgreSQL)

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** on `localhost:5432`
- **API** on `http://localhost:8000`

Access: http://localhost:8000/docs

---

## ☁️ Cloud Deployment

### Azure Container Instances

```bash
az acr build --registry myregistry --image todo-api:latest .
az container create \
  --resource-group mygroup \
  --name todo-api \
  --image myregistry.azurecr.io/todo-api:latest \
  --ports 8000 \
  --environment-variables \
    ENV=PRODUCTION \
    DATABASE_URL=postgresql://user:pass@mydb.postgres.database.azure.com:5432/todo \
    JWT_SECRET_KEY=production-secret-key-32-chars-min
```

### AWS ECS

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag todo-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/todo-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/todo-api:latest
```

### Heroku

```bash
heroku container:push web
heroku container:release web
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET_KEY=production-secret-key
```

---

## 🔐 Environment Variables

**Development (.env)**
```
ENV=DEVELOPMENT
DATABASE_URL=sqlite:///./todo.db
JWT_SECRET_KEY=dev-secret-key-change-in-production
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:8000"]
```

**Production (.env)**
```
ENV=PRODUCTION
DATABASE_URL=postgresql://user:password@hostname:5432/todo_db
JWT_SECRET_KEY=production-secret-key-minimum-32-characters-long!
LOG_LEVEL=WARNING
CORS_ORIGINS=["https://yourdomain.com"]
HOST=0.0.0.0
PORT=8000
```

---

## 📝 Testing User Isolation

1. **Register User 1:**
   ```
   Email: alice@example.com
   Password: password123
   ```

2. **Create Task (User 1):**
   ```
   Title: "Alice's task"
   ```

3. **Register User 2:**
   ```
   Email: bob@example.com
   Password: password456
   ```

4. **Create Task (User 2):**
   ```
   Title: "Bob's task"
   ```

5. **Verify Isolation:**
   - Login as Alice → See only "Alice's task" ✅
   - Login as Bob → See only "Bob's task" ✅
   - Try to access Bob's task as Alice → 403 Forbidden ✅

---

## 📊 Project Structure

```
Online To-Do List (Multi-User)/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, routes
│   ├── config.py            # Environment configuration
│   ├── database.py          # SQLAlchemy setup
│   ├── models.py            # User & Task ORM models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT & password hashing
│   ├── tasks.py             # Task CRUD endpoints
│   └── logging.py           # Centralized logging
├── .env                     # Environment variables (local)
├── .env.example             # Environment template
├── .dockerignore            # Docker ignore patterns
├── .gitignore               # Git ignore patterns
├── Dockerfile               # Production Docker image
├── docker-compose.yml       # Full stack with PostgreSQL
├── requirements.txt         # Python dependencies
├── README.md                # This file
└── todo.db                  # SQLite database (local only)
```

---

## 🔧 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.104.1 |
| Server | Uvicorn | 0.24.0 |
| Database | SQLAlchemy | 2.0.23 |
| DB Support | PostgreSQL | 2.9.9 (psycopg2) |
| Authentication | python-jose | 3.3.0 |
| Password Hashing | bcrypt | 5.0.0 |
| Validation | Pydantic | 2.5.0 |
| Environment | python-dotenv | 1.0.0 |

---

## 🎓 Learning Resources

### JWT Authentication
- Token contains `user_id` and expiration time
- Always verify token before processing requests
- Never trust `user_id` from client input

### User Isolation Pattern
- Add `user_id` foreign key to all user-scoped resources
- Filter queries by current user: `.filter(Model.user_id == current_user.id)`
- Verify ownership before update/delete operations

### Database Migration (SQLite → PostgreSQL)
1. Change `DATABASE_URL=postgresql://...` in .env
2. No code changes needed (SQLAlchemy handles it)
3. Run migrations or use `Base.metadata.create_all()`

---

## 📞 Support & Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env or use different port
uvicorn app.main:app --port 8001
```

**Database locked (SQLite):**
```bash
# Remove todo.db to reset
rm todo.db
# API will recreate it on startup
```

**Invalid token:**
```
Response: 401
{
  "detail": "Invalid or expired token"
}
```
Solution: Get a new token by logging in

**Unauthorized access:**
```
Response: 403
{
  "detail": "Not authorized to access this task"
}
```
Solution: Check `user_id` matches task owner

---

## 📦 Deployment Checklist

- [ ] Change `JWT_SECRET_KEY` to a strong random value
- [ ] Set `ENV=PRODUCTION` in .env
- [ ] Use PostgreSQL in production
- [ ] Configure `CORS_ORIGINS` for your frontend domain
- [ ] Set `LOG_LEVEL=WARNING` to reduce log volume
- [ ] Use HTTPS in production
- [ ] Enable database backups
- [ ] Monitor API logs
- [ ] Set up health check monitoring

---

**Last Updated:** December 19, 2025  
**Status:** Production Ready ✅
