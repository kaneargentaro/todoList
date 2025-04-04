from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.controllers.login import LoginController, LoginPayload
from src.middlewares.authentication import auth_middleware
from src.config.database import get_db

router = APIRouter()
login_controller = LoginController()

@router.get("/")
async def get_login(auth: dict = Depends(auth_middleware)):
    """Get login status for authenticated user"""
    return await login_controller.get_login(auth)

@router.post("/")
async def post_login(login_data: LoginPayload, db: Session = Depends(get_db)):
    """Handle user login"""
    return await login_controller.post_login(login_data, db) 