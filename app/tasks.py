from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Task
from app.schemas import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from app.auth import get_current_user
from app.logging import log_unauthorized_task_access, logger

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=TaskListResponse)
async def get_tasks(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get all tasks for the current user."""
    try:
        tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
        logger.info(f"User {current_user.email} retrieved {len(tasks)} tasks")
        return TaskListResponse(tasks=tasks, total=len(tasks))
    except Exception as e:
        logger.error(f"Error retrieving tasks for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve tasks",
        )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new task for the current user."""
    try:
        new_task = Task(
            title=task_data.title,
            description=task_data.description or "",
            user_id=current_user.id,
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        logger.info(f"User {current_user.email} created task: {new_task.id}")
        return new_task
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating task for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create task",
        )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific task by ID (only if it belongs to the current user)."""
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        if task.user_id != current_user.id:
            log_unauthorized_task_access(current_user.id, task_id)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this task"
            )
        return task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving task {task_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve task",
        )


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a task (only if it belongs to the current user)."""
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        if task.user_id != current_user.id:
            log_unauthorized_task_access(current_user.id, task_id)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this task"
            )

        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
        if task_data.completed is not None:
            task.completed = task_data.completed

        db.commit()
        db.refresh(task)
        logger.info(f"User {current_user.email} updated task: {task_id}")
        return task
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating task {task_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update task",
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a task (only if it belongs to the current user)."""
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        if task.user_id != current_user.id:
            log_unauthorized_task_access(current_user.id, task_id)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this task"
            )

        db.delete(task)
        db.commit()
        logger.info(f"User {current_user.email} deleted task: {task_id}")
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting task {task_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete task",
        )

