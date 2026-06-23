import './Landing.css';
import Logo from '../Logo';

export default function Landing() {
  return (
    <main className='landing'>
      <h1>
        <Logo />
      </h1>

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