import './Navbar.css'
import {Link} from 'react-router-dom';

function Navbar({ user, setUser }) {
    /*
    Navbar sets the layout for the navigation bar at the top of the page

    this is a component to be placed on a page
    */



    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    }


    return(
        <nav className='navbar'>
            <Link className='navTitle' to='/'>Task Manager</Link>
            <div className='links'>
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <Link className='link' to='/admin'>Admin</Link>
                        )}
                        <Link className='link' to='/tasks'>Tasks</Link>
                        <Link className='link' to='/profile'>Profile</Link>
                        <button className='link' onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link className='link' to='/login'>Login</Link>
                        <Link className='link' to='/register'>Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
};

export default Navbar