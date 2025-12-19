import React, { useState, useEffect } from 'react';
import './App.css';
import AuthPage from './components/AuthPage.js';
import TasksPage from './components/TasksPage.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {isLoggedIn ? (
        <TasksPage onLogout={() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_id');
          setIsLoggedIn(false);
        }} />
      ) : (
        <AuthPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
