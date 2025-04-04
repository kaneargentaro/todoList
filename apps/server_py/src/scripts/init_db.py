import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from src.config.database import engine, SessionLocal
from src.models.user import User
from src.models.note import Note
from sqlalchemy import text
from src.utils.auth import get_password_hash

def init_test_data():
    db = SessionLocal()
    try:
        # Check if we already have users
        result = db.execute(text("SELECT COUNT(*) FROM \"User\""))
        count = result.scalar()
        
        if count == 0:
            # Create test user
            test_user = User(
                email="test@test.com",
                password="admin"  # In a real app, this would be hashed
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)  # Refresh to get the auto-generated ID
            
            # Create test note
            test_note = Note(
                userId=test_user.id,
                message="This is a test note"
            )
            db.add(test_note)
            db.commit()
            
            print("Test user and note created successfully")
        else:
            print("Database already has users, skipping initialization")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Import all models to ensure they are registered with Base
    from src.models.user import User
    from src.models.note import Note
    
    # Create all tables
    from src.config.database import Base
    Base.metadata.create_all(bind=engine)
    
    # Initialize test data
    init_test_data() 