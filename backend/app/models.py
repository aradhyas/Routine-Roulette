from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    device_id: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Task(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    title: str
    est_minutes: int
    energy: str  # 'low', 'medium', 'high'
    status: str = Field(default="open")  # 'open', 'done', 'abandoned'
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class Session(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    task_id: str = Field(foreign_key="task.id")
    started_at: datetime = Field(default_factory=datetime.utcnow)
    finished_at: Optional[datetime] = None
    success: Optional[bool] = None
    notes: Optional[str] = None

# Database setup
DATABASE_URL = "sqlite:///./routine_roulette.db"
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
