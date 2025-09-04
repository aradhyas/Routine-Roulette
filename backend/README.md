# Routine Roulette Backend

FastAPI backend for the Routine Roulette PWA with SQLite database and device-based synchronization.

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# The API will be available at http://localhost:8000
# API documentation at http://localhost:8000/docs
```

## 📊 API Endpoints

### User Management
- `POST /api/register` - Register or get user by device ID

### Task Management
- `POST /api/normalize` - Parse raw text into structured tasks
- `GET /api/tasks?device_id=...` - Get all tasks for a device
- `POST /api/tasks/bulk_upsert` - Bulk create/update tasks

### Session Tracking
- `POST /api/session/start` - Start a work session
- `POST /api/session/finish` - Complete a work session

### Analytics
- `GET /api/stats?device_id=...` - Get user statistics
- `GET /api/metrics` - Get API performance metrics

## 🗄️ Database Schema

### User
- `id` (UUID, primary key)
- `device_id` (text, unique)
- `created_at` (datetime)

### Task
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `title` (text)
- `est_minutes` (integer)
- `energy` ('low'|'medium'|'high')
- `status` ('open'|'done'|'abandoned')
- `created_at` (datetime)
- `updated_at` (datetime, optional)

### Session
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `task_id` (UUID, foreign key)
- `started_at` (datetime)
- `finished_at` (datetime, optional)
- `success` (boolean, optional)
- `notes` (text, optional)

## 🧠 Task Normalization

The `/api/normalize` endpoint uses heuristics to parse natural language task lists:

- **Time Estimation**: Based on task length and keywords (10-25 minutes)
- **Energy Classification**: Low/medium/high based on task type
- **Quality Assessment**: Checks if tasks are actionable and safe

## 📈 Metrics

The backend tracks API latency metrics in memory:
- Request count
- Mean response time
- P50, P95, P99 percentiles

## 🔧 Configuration

### CORS Origins
Configure allowed origins in `app/main.py`:
```python
allow_origins=[
    "http://localhost:5173",  # Vite dev
    "http://127.0.0.1:5173",
    "https://your-domain.com"  # Production
]
```

### Database
SQLite database file: `routine_roulette.db`
Auto-created on first run.

## 🚀 Production Deployment

```bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 🧪 Testing

```bash
# Test the API
curl http://localhost:8000/health

# Register a device
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"device_id": "test-device-123"}'

# Normalize tasks
curl -X POST http://localhost:8000/api/normalize \
  -H "Content-Type: application/json" \
  -d '{"raw_text": "Check emails\nWater plants\nWrite documentation"}'
```
