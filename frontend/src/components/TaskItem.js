import React, { useState } from 'react';
import './TaskItem.css';

function TaskItem({
  task,
  isEditing,
  onEditStart,
  onEditEnd,
  onUpdateTask,
  onDeleteTask,
}) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleComplete = async () => {
    setIsSaving(true);
    try {
      await onUpdateTask(task.id, task.title, task.description, !task.completed);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }
    setIsSaving(true);
    try {
      await onUpdateTask(task.id, editTitle, editDescription, task.completed);
      onEditEnd();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    onEditEnd();
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            disabled={isSaving}
            className="edit-input"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
            disabled={isSaving}
            rows="2"
            className="edit-textarea"
          />
          <div className="edit-actions">
            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="save-btn"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={isSaving}
          className="task-checkbox"
        />
        <div className="task-text">
          <h4 className="task-title">{task.title}</h4>
          {task.description && <p className="task-description">{task.description}</p>}
          <small className="task-date">
            {new Date(task.created_at).toLocaleDateString()}
          </small>
        </div>
      </div>
      <div className="task-actions">
        <button
          onClick={() => onEditStart(task.id)}
          className="edit-btn"
          title="Edit task"
        >
          ✏️
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="delete-btn"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
