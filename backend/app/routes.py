from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import datetime, timedelta
import re

from .models import User, Task, Session as SessionModel, get_session
from .schemas import *
from .utils.metrics import time_operation, latency_tracker

router = APIRouter(prefix="/api")

@router.post("/register", response_model=RegisterResponse)
async def register_user(request: RegisterRequest, db: Session = Depends(get_session)):
    """Create or get user by device_id"""
    # Check if user already exists
    statement = select(User).where(User.device_id == request.device_id)
    user = db.exec(statement).first()
    
    if user:
        return RegisterResponse(user_id=user.id)
    
    # Create new user
    user = User(device_id=request.device_id)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return RegisterResponse(user_id=user.id)

@time_operation("normalize")
def normalize_text(raw_text: str) -> NormalizeResponse:
    """On-device heuristics for normalizing task text"""
    lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
    tasks = []
    
    for line in lines:
        # Skip empty lines or very short lines
        if len(line) < 3:
            continue
            
        # Clean up the line - remove bullets, numbers, etc.
        clean_line = re.sub(r'^[-*•\d+\.\)]\s*', '', line).strip()
        if not clean_line:
            continue
            
        # Estimate minutes based on task complexity
        est_minutes = 15  # default
        if len(clean_line) < 20:
            est_minutes = 10
        elif len(clean_line) < 50:
            est_minutes = 15
        elif len(clean_line) < 100:
            est_minutes = 20
        else:
            est_minutes = 25
            
        # Determine energy level based on keywords
        energy = "medium"  # default
        low_energy_words = ['read', 'review', 'check', 'browse', 'look', 'watch']
        high_energy_words = ['create', 'build', 'write', 'design', 'implement', 'develop', 'exercise', 'workout']
        
        line_lower = clean_line.lower()
        if any(word in line_lower for word in low_energy_words):
            energy = "low"
        elif any(word in line_lower for word in high_energy_words):
            energy = "high"
            
        tasks.append(TaskNormalized(
            title=clean_line,
            est_minutes=est_minutes,
            energy=energy
        ))
    
    # Quality assessment
    quality = QualityMetrics(
        actionable=len(tasks) > 0 and all(len(task.title) > 5 for task in tasks),
        size_ok=len(tasks) <= 10 and len(tasks) > 0,
        safe=all('delete' not in task.title.lower() and 'remove' not in task.title.lower() for task in tasks)
    )
    
    return NormalizeResponse(tasks=tasks, quality=quality)

@router.post("/normalize", response_model=NormalizeResponse)
async def normalize_endpoint(request: NormalizeRequest):
    """Normalize raw text into structured tasks"""
    return normalize_text(request.raw_text)

@router.get("/tasks", response_model=TasksResponse)
async def get_tasks(device_id: str, db: Session = Depends(get_session)):
    """Get all tasks for a device"""
    # Get user
    user_statement = select(User).where(User.device_id == device_id)
    user = db.exec(user_statement).first()
    
    if not user:
        return TasksResponse(tasks=[])
    
    # Get tasks
    task_statement = select(Task).where(Task.user_id == user.id)
    tasks = db.exec(task_statement).all()
    
    task_responses = [
        TaskResponse(
            id=task.id,
            title=task.title,
            est_minutes=task.est_minutes,
            energy=task.energy,
            status=task.status,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        for task in tasks
    ]
    
    return TasksResponse(tasks=task_responses)

@router.post("/tasks/bulk_upsert", response_model=BulkUpsertResponse)
async def bulk_upsert_tasks(request: BulkUpsertRequest, db: Session = Depends(get_session)):
    """Bulk upsert tasks for a device"""
    # Get or create user
    user_statement = select(User).where(User.device_id == request.device_id)
    user = db.exec(user_statement).first()
    
    if not user:
        user = User(device_id=request.device_id)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    upserted_count = 0
    
    for task_data in request.tasks:
        if task_data.id:
            # Update existing task
            task_statement = select(Task).where(Task.id == task_data.id, Task.user_id == user.id)
            existing_task = db.exec(task_statement).first()
            
            if existing_task:
                existing_task.title = task_data.title
                existing_task.est_minutes = task_data.est_minutes
                existing_task.energy = task_data.energy
                existing_task.status = task_data.status
                existing_task.updated_at = datetime.utcnow()
                upserted_count += 1
        else:
            # Create new task
            new_task = Task(
                user_id=user.id,
                title=task_data.title,
                est_minutes=task_data.est_minutes,
                energy=task_data.energy,
                status=task_data.status
            )
            db.add(new_task)
            upserted_count += 1
    
    db.commit()
    return BulkUpsertResponse(upserted=upserted_count)

@router.post("/session/start", response_model=SessionStartResponse)
async def start_session(request: SessionStartRequest, db: Session = Depends(get_session)):
    """Start a new session"""
    # Get user
    user_statement = select(User).where(User.device_id == request.device_id)
    user = db.exec(user_statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create session
    session = SessionModel(
        user_id=user.id,
        task_id=request.task_id
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return SessionStartResponse(
        session_id=session.id,
        started_at=session.started_at
    )

@router.post("/session/finish", response_model=SessionFinishResponse)
async def finish_session(request: SessionFinishRequest, db: Session = Depends(get_session)):
    """Finish a session"""
    # Get user
    user_statement = select(User).where(User.device_id == request.device_id)
    user = db.exec(user_statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get session
    session_statement = select(SessionModel).where(
        SessionModel.id == request.session_id,
        SessionModel.user_id == user.id
    )
    session = db.exec(session_statement).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Update session
    session.finished_at = datetime.utcnow()
    session.success = request.success
    session.notes = request.notes
    
    db.commit()
    
    return SessionFinishResponse(ok=True)

@router.get("/stats", response_model=StatsResponse)
async def get_stats(device_id: str, db: Session = Depends(get_session)):
    """Get user statistics"""
    # Get user
    user_statement = select(User).where(User.device_id == device_id)
    user = db.exec(user_statement).first()
    
    if not user:
        return StatsResponse(total_minutes=0, streak_days=0, sessions=[])
    
    # Get completed sessions
    session_statement = select(SessionModel, Task).join(Task).where(
        SessionModel.user_id == user.id,
        SessionModel.finished_at.isnot(None)
    )
    sessions = db.exec(session_statement).all()
    
    # Calculate total minutes
    total_minutes = 0
    session_stats = []
    
    for session, task in sessions:
        if session.finished_at and session.started_at:
            duration = session.finished_at - session.started_at
            minutes = int(duration.total_seconds() / 60)
            total_minutes += minutes
            
            session_stats.append(SessionStat(
                id=session.id,
                title=task.title,
                minutes=minutes,
                created_at=session.started_at
            ))
    
    # Calculate streak (simplified - consecutive days with sessions)
    streak_days = 0
    if session_stats:
        # Sort by date
        session_stats.sort(key=lambda x: x.created_at, reverse=True)
        
        # Count consecutive days
        current_date = datetime.utcnow().date()
        for session_stat in session_stats:
            session_date = session_stat.created_at.date()
            if session_date == current_date or session_date == current_date - timedelta(days=streak_days):
                if session_date == current_date - timedelta(days=streak_days):
                    streak_days += 1
                current_date = session_date
            else:
                break
    
    return StatsResponse(
        total_minutes=total_minutes,
        streak_days=streak_days,
        sessions=session_stats[:10]  # Return last 10 sessions
    )

@router.get("/metrics", response_model=MetricsResponse)
async def get_metrics():
    """Get API metrics"""
    normalize_stats = latency_tracker.get_stats("normalize")
    
    return MetricsResponse(
        normalize_latency_ms=LatencyMetrics(
            count=normalize_stats["count"],
            mean=normalize_stats["mean"],
            p50=normalize_stats["p50"],
            p95=normalize_stats["p95"],
            p99=normalize_stats["p99"]
        )
    )
