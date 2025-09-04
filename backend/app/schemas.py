from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    device_id: str

class RegisterResponse(BaseModel):
    user_id: str

class NormalizeRequest(BaseModel):
    raw_text: str

class TaskNormalized(BaseModel):
    title: str
    est_minutes: int
    energy: str

class QualityMetrics(BaseModel):
    actionable: bool
    size_ok: bool
    safe: bool

class NormalizeResponse(BaseModel):
    tasks: List[TaskNormalized]
    quality: QualityMetrics

class TaskUpsert(BaseModel):
    id: Optional[str] = None
    title: str
    est_minutes: int
    energy: str
    status: str = "open"
    updated_at: Optional[datetime] = None

class BulkUpsertRequest(BaseModel):
    device_id: str
    tasks: List[TaskUpsert]

class BulkUpsertResponse(BaseModel):
    upserted: int

class TaskResponse(BaseModel):
    id: str
    title: str
    est_minutes: int
    energy: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class TasksResponse(BaseModel):
    tasks: List[TaskResponse]

class SessionStartRequest(BaseModel):
    device_id: str
    task_id: str
    est_minutes: int

class SessionStartResponse(BaseModel):
    session_id: str
    started_at: datetime

class SessionFinishRequest(BaseModel):
    device_id: str
    session_id: str
    success: bool
    notes: Optional[str] = None

class SessionFinishResponse(BaseModel):
    ok: bool

class SessionStat(BaseModel):
    id: str
    title: str
    minutes: int
    created_at: datetime

class StatsResponse(BaseModel):
    total_minutes: int
    streak_days: int
    sessions: List[SessionStat]

class LatencyMetrics(BaseModel):
    count: int
    mean: float
    p50: float
    p95: float
    p99: float

class MetricsResponse(BaseModel):
    normalize_latency_ms: LatencyMetrics
