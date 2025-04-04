from fastapi import HTTPException, Depends
from jose import jwt
import os
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
from typing import Optional
import logging
from sqlalchemy.orm import Session
from src.config.database import get_db
from src.models.user import User
from src.utils.auth import verify_password

load_dotenv()

logger = logging.getLogger(__name__)

class LoginPayload(BaseModel):
    email: EmailStr
    password: str

class LoginController:
    def __init__(self):
        self.JWT_SECRET = os.getenv("JWT_SECRET")
        self.JWT_ALGORITHM = "HS256"

    async def get_login(self, auth: dict):
        """Handle GET /login - check if user is logged in"""
        if not auth or "email" not in auth:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        email = auth["email"]
        logger.info(f"{email} is logged in")
        return {"message": f"{email} is logged in"}

    async def post_login(self, login_data: LoginPayload, db: Session):
        """Handle POST /login - authenticate user and return JWT"""
        logger.info(f"Login attempt from: {login_data.email}")
        
        # Find user in database
        user = db.query(User).filter(User.email == login_data.email).first()
        logger.info(f"Found user: {user is not None}")
        logger.info(f"Found user: {user}")

        if not user:
            logger.warning(f"User not found with email: {login_data.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        # In a real app, you would hash the password and compare hashes
        # For now, we're doing a simple comparison
        logger.info(f"Password check: '{user.password}' vs '{login_data.password}'")
        if user.password != login_data.password:
            logger.warning(f"Invalid password for user: {login_data.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Create JWT token
        token = jwt.encode(
            {"user_id": str(user.id), "email": user.email},
            self.JWT_SECRET,
            algorithm=self.JWT_ALGORITHM
        )

        logger.info(f"{login_data.email} successfully logged in")
        return {"message": "Login successful", "token": token} 