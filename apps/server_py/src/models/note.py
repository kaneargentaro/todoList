from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from src.config.database import Base

class Note(Base):
    __tablename__ = "Note"

    id = Column(UUID(as_uuid=False), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    message = Column(String, nullable=True, default="")
    userId = Column(String, ForeignKey("User.id"))
    createdAt = Column(DateTime, nullable=False, default=datetime.utcnow)
    updatedAt = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with User model
    user = relationship("User", back_populates="notes") 