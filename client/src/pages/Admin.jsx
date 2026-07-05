import './Admin.css';

export default function Admin({ user }) {
    return (
        <main className='adminPage'>
            <h1 className='adminTitle'>Admin Dashboard</h1>
            <p>Welcome, {user?.username}</p>
            <p>Your role is: {user?.role}</p>

            <section>
                <p>Manage Users</p>
                <p>Manage Tasks</p>
            </section>
        </main>
    )
};