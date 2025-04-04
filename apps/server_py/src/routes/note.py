from fastapi import APIRouter, Depends, HTTPException
from typing import List
from src.controllers.note import NoteController, NotePayload
from src.middlewares.authentication import auth_middleware
from src.config.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()
note_controller = NoteController()

@router.get("/", response_model=List[dict])
async def get_notes(auth: dict = Depends(auth_middleware), db: Session = Depends(get_db)):
    if "user_id" not in auth:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await note_controller.get_notes(db, auth["user_id"])

@router.post("/", response_model=dict)
async def create_note(note_data: NotePayload, auth: dict = Depends(auth_middleware), db: Session = Depends(get_db)):
    if "user_id" not in auth:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await note_controller.create_note(db, auth["user_id"], note_data) 