from fastapi import Request, HTTPException, Depends
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

async def auth_middleware(request: Request):
    """
    Authentication middleware that checks for JWT token in headers
    Returns the decoded token payload or an empty dict
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return {}  # No token provided
    
    token = auth_header.split(" ")[1]
    
    try:
        # Decode and verify the token
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        logger.info(f"Successfully authenticated user: {payload.get('email')}")
        return payload
    except JWTError as e:
        logger.warning(f"Invalid token: {str(e)}")
        return {} 