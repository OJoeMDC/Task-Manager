import './Profile.css';

export default function Profile() {
    const user = JSON.parse(localStorage.getItem('user'));
    const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    if(!user) {
        return (
            <main className='profilePage'>
                <h1>You are not logged in</h1>
                <a href='/login' className='button'>LOGIN</a>
            </main>
        );
    };


    return (
        <main className="profilePage">
            <h1>Welcome, {user.username}!</h1>
            <p className='temp'>More profile management to come</p>

            <button
            className="button"
            onClick={logout}
            >Logout</button>
        </main>
    );
};