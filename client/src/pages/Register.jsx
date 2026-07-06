import './AccountForm.css';
import { useState } from 'react';

export default function Register({ setUser, user, API_URL }) {

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

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration Failed');
        return;
      }

      setSuccess(true);
      setUsername('');
      setPassword('');
    } catch (err) {
      //Unexpected error
      console.log(err.message);
      setError('Unexpected error during registration. Please contact developer if the problem persists.');
    }
  };

  return (
    <main className='accountPage'>
      <h1 className='accountTitle'>Create an Account</h1>

      <form onSubmit={addUser} className='accountForm'>
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

        <button
        className='button'
        type='submit'
        disabled={success}>
          Register
        </button>

        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>Account Created</p>}
      </form>

      <p className='loginFooter'>Already have an account? <a href='/login' className='button'>Login</a></p>
    </main>
  );
}