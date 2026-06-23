import { useState} from "react";
import './AccountForm.css'

export default function Login({ setUser, user }) {
    const API_URL = `${import.meta.env.VITE_API_URL}`;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const loginUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const res = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login Failed');
            }

            setSuccess(true);
            setLoggedInUser(data.user);
            setUsername(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className='accountPage'>
            <h1 className='loginTitle'>Login</h1>
            <form onSubmit={loginUser} className='accountForm'>
                <div className='formEntry'>
                    <label htmlFor='username'>Username</label>
                    <input
                    id='username'
                    type='text'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
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
                    placeholder="Password"
                    required/>
                </div>

                <button
                className='button'
                type='submit'>
                    Login
                </button>

                {error && <p className='error'>{error}</p>}
                {success && <p className='success'>Logged in</p>}
                {loggedInUser && <p>Logged in as: {user.username}</p>}
            </form>
        </main>
    );
    console.log({success});
};