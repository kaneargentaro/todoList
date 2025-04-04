from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
from pydantic import BaseModel
from src.config.database import get_db
from src.models.note import Note
from src.models.user import User
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

# Define the note payload schema using Pydantic
class NotePayload(BaseModel):
    message: Optional[str] = ""

class NoteController:
    async def get_notes(self, db: Session, user_id: str) -> List[dict]:
        """Get all notes for a user"""
        notes = db.query(Note).filter(Note.userId == user_id).all()
        logger.info(f"User {user_id} fetched their notes")
        # Convert SQLAlchemy objects to dictionaries
        return [{"id": str(note.id), "message": note.message, "createdAt": note.createdAt} for note in notes]

    async def create_note(self, db: Session, user_id: str, note_data: NotePayload) -> dict:
        """Create a new note for a user"""
        # Get current time for timestamps
        now = datetime.utcnow()
        note_id = str(uuid.uuid4())
        
        # Create a new note
        new_note = Note(
            id=note_id,
            userId=user_id,
            message=note_data.message,
            createdAt=now,
            updatedAt=now
        )
        
        # Add to database
        db.add(new_note)
        db.commit()
        # No refresh to avoid UUID issues
        
        logger.info(f"User {user_id} created a note with ID: {note_id}")
        return {"id": note_id, "message": note_data.message, "createdAt": now} 