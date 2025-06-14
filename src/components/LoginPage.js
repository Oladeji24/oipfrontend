import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <div className="text-center mt-3">
        <button className="btn btn-link" onClick={() => setIsRegister(r => !r)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
