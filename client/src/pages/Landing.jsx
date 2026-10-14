import './Landing.css';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import {FilePlus2, Settings, ChartNoAxesColumnIncreasing, ArrowRight, LogIn, UserRoundPlus, User, UserRound } from 'lucide-react';

export default function Landing({ user }) {
  /*
  Landing is the main front page
  */

  
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
              <Link className='button' to='/tasks'>View Dashboard <ArrowRight size={32} /></Link>
            ) : (
              <>
                <Link className='button' to='/login'>
                Login
                <LogIn size={24} />
                </Link> 
                <Link className='button' to='/register'>
                Register
                <UserRoundPlus size={24} />
                </Link> 
              </>
            )}
          </div>
      </div>

      <section className='landing-content'>
      </section>

      <section className='cards'>
        <article className='card'>
          <div className='card-header-icon'>
            <div className='card-icon'>
              <FilePlus2 size={32} />
            </div>
              <div className='card-header'>
              <p>01</p>
              <h3 className='card-title'>Task Creation</h3>
            </div>
          </div>
          <p>Create tasks with a title, description, and due date.</p>
        </article>

        <article className='card'>
          <div className='card-header-icon'>
            <div className='card-icon'>
              <Settings size={32} />
            </div>
              <div className='card-header'>
              <p>02</p>
              <h3 className='card-title'>Task Management</h3>
            </div>
          </div>
          <p>Manage your tasks with ease, update their status, and set reminders.</p>
        </article>

         <article className='card'>
          <div className='card-header-icon'>
            <div className='card-icon'>
              <ChartNoAxesColumnIncreasing size={32} />
            </div>
              <div className='card-header'>
              <p>03</p>
              <h3 className='card-title'>Stay Organized</h3>
            </div>
          </div>
          <p>Keep your tasks sorted and prioritized for maximum productivity.</p>
        </article>

      </section>
    </main>
  );
};