import './Register.css';


export default function Register() {
    const API_URL = `${import.meta.env.VITE_API_URL}`

    //Create New User
    const addUser = (username, password) => {
        fetch(`${API_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},

            body: JSON.stringify({ username, password }),
        })
    }

    return (
        <div>
            <h1>Register Page</h1>
            <p>Registration form will go here.</p>
        </div>
    );
};