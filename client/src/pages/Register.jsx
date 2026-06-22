import './Register.css';
import { useState } from 'react';

export default function Register() {
  const API_URL = `${import.meta.env.VITE_API_URL}`;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className='registerPage'>
      <h1 className='registerTitle'>Create an Account</h1>

      <form onSubmit={addUser} className='registerForm'>
        <div className='formEntry'>
          <label htmlFor='username'>Username</label>
          <input
            id='username'
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='Username'
            required
          />
        </div>

        <div className='formEntry'>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Password'
            required
            minLength={6}
          />
        </div>

        <button type='submit' disabled={success}>
          Register
        </button>

        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>Account Created! <a href='/login'>Login</a></p>}
      </form>

      <p className='loginFooter'>Already have an account? <a href='/login'>Login</a></p>
    </main>
  );
}