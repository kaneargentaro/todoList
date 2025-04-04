from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from src.config.database import Base

class User(Base):
    __tablename__ = "User"

    id = Column(UUID(as_uuid=False), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=True, default="")
    email = Column(String, unique=True, index=True)
    password = Column(String)  # In a real app, this should be hashed
    createdAt = Column(DateTime, nullable=False, default=datetime.utcnow)
    updatedAt = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with Note model
    notes = relationship("Note", back_populates="user") 