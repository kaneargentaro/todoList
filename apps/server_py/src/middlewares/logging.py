from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import logging
import uuid
from typing import Callable

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate a unique request ID
        request_id = str(uuid.uuid4())
        
        # Create a child logger with the request ID
        logger = logging.getLogger(__name__)
        child_logger = logging.LoggerAdapter(logger, {"request_id": request_id})
        
        # Log the incoming request
        child_logger.info(
            f"Incoming request",
            extra={
                "method": request.method,
                "url": str(request.url),
                "client": request.client.host if request.client else None
            }
        )
        
        # Process the request
        response = await call_next(request)
        
        # Log the response
        child_logger.info(
            f"Request completed",
            extra={
                "status_code": response.status_code,
                "method": request.method,
                "url": str(request.url)
            }
        )
        
        return response 