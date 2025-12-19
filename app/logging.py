import logging
import sys
from app.config import LOG_LEVEL

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ],
)

logger = logging.getLogger(__name__)

def log_auth_failure(email: str, reason: str):
    """Log failed authentication attempts."""
    logger.warning(f"Auth failure for {email}: {reason}")

def log_unauthorized_task_access(user_id: int, task_id: int):
    """Log unauthorized task access attempts."""
    logger.warning(f"Unauthorized task access: user_id={user_id}, task_id={task_id}")

def log_database_error(error: str):
    """Log database errors."""
    logger.error(f"Database error: {error}")

def log_request(method: str, path: str, user_id: int = None):
    """Log API requests."""
    logger.info(f"Request: {method} {path} (user_id={user_id})")
