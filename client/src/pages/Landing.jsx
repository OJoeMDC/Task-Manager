import './Landing.css';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

export default function Landing({ user }) {
  return (
    <main className='landing'>
      <div className='landingHero'>
        <h1>
          <Logo />
        </h1>
        <p className='subtitle'>Organize tasks with this full-stack application built using 
          <span className='highlight'> React</span>, 
          <span className='highlight'> Express</span>, and
           <span className='highlight'> SQLite</span></p>
          <div className='landingCTA'>
            {user ? (
              <Link className='button' to='/tasks'>View Dashboard</Link>
            ) : (
              <>
                <Link className='button' to='/login'>Login</Link> <p>or</p> <Link className='button' to='/register'>Register</Link> <p>to get started</p>
              </>
            )}
          </div>
      </div>

      <section className='landing-content'>
      </section>

      <section className='cards'>
        <article className='card'>
          <h3 className='card-title'>Task Creation</h3>
          <p>Create tasks with a title, description, and due date.</p>
        </article>

        <article className='card'>
          <h3 className='card-title'>Task Management</h3>
          <p>Manage your tasks with ease, update their status, and set reminders.</p>
        </article>

         <article className='card'>
          <h3 className='card-title'>Stay Organized</h3>
          <p>Keep your tasks sorted and prioritized for maximum productivity.</p>
        </article>

      </section>
    </main>
  );
};