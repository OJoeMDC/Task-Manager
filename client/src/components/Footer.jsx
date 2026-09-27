import './Footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
    /*
    Footer defines the buttons and links in the footer of this webpage

    this is a component to be placed on a page
    */


    
return (
    <footer className='footer'>
        <div className='description'>
            <h3>Task Manager</h3>
            <p className='subtext'>A full-stack task management app built with React, Express, and SQLITE</p>
        </div>
        <div className='footerLinks'>
            <p>
                <a
                    className='link'
                    href='https://github.com/OJoeMDC'
                    target='_blank' 
                    rel='noopener noreferer'
                >
                    Github
                </a>
                {" | "}
                <a 
                    className='link'
                    href='https://osceoladev.com'
                    target='_blank' 
                    rel='noopener noreferer'
                > 
                    Portfolio
                </a>
                {" | "}
                <a 
                    className='link' 
                    href='https://www.linkedin.com/in/osceola-martin-del-campo-0ab1b6328/' 
                    target='_blank' 
                    rel='noopener noreferer'
                >
                    LinkedIn
                </a>
            </p>
            <div className='copyright'>
                <p>© {new Date().getFullYear()} Osceola Martin del Campo</p>
            </div>
        </div>
    </footer>
)
}