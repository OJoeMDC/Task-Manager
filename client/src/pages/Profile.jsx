import { Link } from 'react-router-dom';
import './Profile.css';
import { LogOut } from 'lucide-react';

export default function Profile({ setUser, user, toggleIdVisibility, idVisibility }) {
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


            <div className="profileHeader">
                <h1>Profile</h1>
                <p>Manage your profile information</p>
            </div>


            <div className="profileInfo">
                <h2 className="profileInfoTitle">Account Information</h2>
                <div className="profileDetails">
                    <h3>Username</h3>
                    <p className="highlight">{user?.username}</p>
                    <h3>Role</h3>
                    <p className="highlight">{user?.role}</p>
                </div>
            </div>


            <div className='displaySettings'>
                <h2 className="profileInfoTitle">Display Settings</h2>
                <div className="profileDetails">
                    <span className='setting'>
                        <p>Task ID Visibility: <span className="highlight">{idVisibility ? 'Visible' : 'Hidden'}</span></p>
                        <label className="switch">
                            <input 
                            type='checkbox'
                            checked={idVisibility}
                            onChange={() => toggleIdVisibility()}
                             />
                             <span className='slider'></span>
                        </label>
                    </span>
                </div>
            </div>


            <div className="profileLinks">
                <button
                className="button logout"
                onClick={logout}
                >
                    <LogOut size={32} />
                    Logout
                </button>

                {user.role === 'admin' && (
                    <Link to='/admin' className='button'>Admin Dashboard</Link>
                )}
            </div>
            
        </main>
    );
};

 