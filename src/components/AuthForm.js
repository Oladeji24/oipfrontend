// src/components/AuthForm.js
import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { login, register } from '../api/auth';
import { useToast } from '../utils/ToastContext';

const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onAuth && onAuth();
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed';
      setError(msg);
      showToast(msg, 'danger');
    }
    setLoading(false);
  };

  return (
    <Card className="mb-4" style={{ maxWidth: 400, margin: '0 auto' }}>
      <Card.Body>
        <h3 className="mb-3">{isLogin ? 'Login' : 'Register'}</h3>
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={loading} className="w-100 mb-2">
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </Button>
        </Form>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="w-100">
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AuthForm;
