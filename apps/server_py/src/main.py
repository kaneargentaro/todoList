from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from typing import Union
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our routes
from src.routes import login, note
# Import our middleware
from src.middlewares.authentication import auth_middleware
from src.middlewares.logging import RequestLoggingMiddleware
from src.config.database import init_db

# Get configuration from environment variables
PORT = int(os.getenv("PY_SERVER_PORT", 8000))  # Default to 8000 if not set
HOST = os.getenv("HOST", "0.0.0.0")  # Default to 0.0.0.0 if not set

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager for the FastAPI application.
    Similar to Hono's startup functionality.
    """
    # Initialize database on startup
    await init_db()
    logger.info("Starting up FastAPI application")
    yield
    logger.info("Shutting down FastAPI application")

app = FastAPI(lifespan=lifespan)

# Configure CORS - matching your TypeScript server's configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Consider restricting in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Length"],
    max_age=600,
)

# Add logging middleware
app.add_middleware(RequestLoggingMiddleware)

# Public routes (no authentication required)
app.include_router(login.router, prefix="/login", tags=["login"])

# Protected routes (require authentication)
app.include_router(
    note.router,
    prefix="/notes",
    tags=["notes"]
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global error handler - similar to your TypeScript server's onError handler
    """
    logger.error(f"Unhandled error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=True  # Enable auto-reload during development
    )