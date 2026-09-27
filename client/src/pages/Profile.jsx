import { Link } from 'react-router-dom';
import './Profile.css';

export default function Profile({ setUser, user, API_URL, showMessage }) {
    /*
    This is a user's profile self management page
    */

    //Handles logging out of a user
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    }


    //returns error page if no user is logged in
    if(!user) {
        return (
            <main className='profilePage'>
                <h1>You are not logged in</h1>
                <Link to='/login' className='button'>LOGIN</Link>
            </main>
        );
    };

    //normal page for logged in user
    return (
        <main className="profilePage">
            <h1>Welcome, {user.username}!</h1>
            <p>You role is currently: <span className="highlight">{user?.role}</span></p>
            <div className="profileLinks">
                <button
                className="button"
                onClick={logout}
                >
                    Logout
                </button>

                {user.role === 'admin' && (
                    <Link to='/admin' className='button'>Admin Dashboard</Link>
                )}
            </div>
            
        </main>
    );
};