import React, { useState } from 'react';
import TaskItem from './TaskItem.js';
import './TaskList.css';

function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  const [editingId, setEditingId] = useState(null);

  const handleEditStart = (id) => {
    setEditingId(id);
  };

  const handleEditEnd = () => {
    setEditingId(null);
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="task-list">
      {pendingTasks.length > 0 && (
        <div className="task-section">
          <h3 className="section-title">📋 Active Tasks</h3>
          <div className="tasks">
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="task-section">
          <h3 className="section-title">✅ Completed Tasks</h3>
          <div className="tasks">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
