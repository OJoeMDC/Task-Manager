import './Navbar.css'

function Navbar() {


    return(
        <main className='navbar'>
            <a className='navTitle' href='/'>Task Manager</a>
            <div className='links'>
            <a className='nav-link' href='/tasks'>Tasks</a>
            <a className='nav-link' href='/profile'>Profile</a>
            <a className='nav-link' href='/login'>Login</a>
            <a className='nav-link' href='/register'>Register</a>
            </div>
        </main>
    )
};

export default Navbar