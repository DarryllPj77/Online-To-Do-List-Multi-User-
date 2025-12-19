import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../api.js';
import TaskList from './TaskList.js';
import TaskForm from './TaskForm.js';
import './TasksPage.css';

function TasksPage({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks();
      setTasks(response.data.tasks);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title, description) => {
    try {
      await tasksAPI.createTask(title, description);
      await loadTasks();
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleUpdateTask = async (id, title, description, completed) => {
    try {
      await tasksAPI.updateTask(id, title, description, completed);
      await loadTasks();
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(id);
        await loadTasks();
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-card">
        <div className="tasks-header">
          <h1>📝 My Tasks</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <TaskForm onAddTask={handleAddTask} />

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <>
            <div className="task-stats">
              <span className="stat">Total: {tasks.length}</span>
              <span className="stat">
                Completed: {tasks.filter((t) => t.completed).length}
              </span>
              <span className="stat">
                Pending: {tasks.filter((t) => !t.completed).length}
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="no-tasks">No tasks yet. Create one to get started!</div>
            ) : (
              <TaskList
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
