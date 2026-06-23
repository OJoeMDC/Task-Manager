import './Navbar.css'
import {Link} from 'react-router-dom';

function Navbar({ user, setUser }) {
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
                        <Link className='nav-link' to='/tasks'>Tasks</Link>
                        <Link className='nav-link' to='/profile'>Profile</Link>
                    </>
                ) : (
                    <>
                        <Link className='nav-link' to='/tasks'>Tasks</Link>
                        <Link className='nav-link' to='/profile'>Profile</Link>
                        <Link className='nav-link' to='/login'>Login</Link>
                        <Link className='nav-link' to='/register'>Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
};

export default Navbar