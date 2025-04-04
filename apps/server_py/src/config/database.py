from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging
import time

# Load environment variables from .env file
load_dotenv()

# Get database connection details from environment variables
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "admin")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5555")
DB_NAME = os.getenv("DB_NAME", "postgres")

# Construct the database URL
DATABASE_URL = os.getenv("DB_URL", f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

# Configure logging
logger = logging.getLogger(__name__)

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Import all models to ensure they are registered with Base
from src.models.note import Note
from src.models.user import User

def get_db():
    """
    Dependency function to get a database session.
    Used with FastAPI's dependency injection system.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def init_db():
    """
    Initialize the database connection with retry logic.
    """
    # Import all models to ensure they are registered with Base
    from src.models.user import User
    from src.models.note import Note
    
    max_retries = 5
    retry_delay = 2  # seconds
    logger.info(f'database url: {DATABASE_URL}');
    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting to connect to database (attempt {attempt + 1}/{max_retries})")
            # Create all tables
            Base.metadata.create_all(bind=engine)
            logger.info("Database connection established successfully")
            return
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                logger.error("Maximum retry attempts reached. Could not connect to database.")
                # Allow the app to start even if the database is not available
                logger.warning("Continuing application startup without database connection")
                return