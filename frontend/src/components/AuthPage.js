import React, { useState } from 'react';
import { authAPI } from '../api.js';
import './AuthPage.css';

function AuthPage({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegistering ? 'register' : 'login';
      const response = await authAPI[endpoint](email, password);
      
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user_id', response.data.user_id);
      
      setEmail('');
      setPassword('');
      onLogin();
    } catch (err) {
      console.error('Auth error:', err);
      const message = err.response?.data?.detail || err.message || 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>📝 To-Do List</h1>
        <p className="subtitle">Manage your tasks online</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Loading...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="toggle-auth">
          {isRegistering ? (
            <>
              Have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                }}
                className="link-btn"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                }}
                className="link-btn"
              >
                Register here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
