import './Navbar.css'
import { NavLink, Link } from 'react-router-dom';

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
            <Link className='navTitle' to='/'>Task <p>Manager</p></Link>
            <div className='links'>
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <NavLink 
                            className={({ isActive }) =>
                                isActive ? 'link active': 'link'
                            }
                            to='/admin'>
                                Admin
                            </NavLink>
                        )}
                        <NavLink className={({ isActive }) =>
                                isActive ? 'link active': 'link'
                            }
                            to='/tasks'>Tasks</NavLink>
                        <NavLink className={({ isActive }) =>
                                isActive ? 'link active': 'link'
                            }
                            to='/profile'>Profile</NavLink>
                    </>
                ) : (
                    <>
                        <Link className='link' to='/login'>Login</Link>
                        <Link className='link' to='/register'><span className='highlight'>Register</span></Link>
                    </>
                )}
            </div>
        </nav>
    )
};

export default Navbar