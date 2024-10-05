import React from 'react';
import './Footer.css';
import { Button } from './Button';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Join the newsleter to recieve updates!
        </p>
        <p className='footer-subscription-text'>
          You can unsubscribe at any time!
        </p>
        <div className='input-areas'>
          <form>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Your Email'
            />
            <Button buttonStyle='btn--outline'>Subscribe</Button>
          </form>
        </div>
      </section>

      <div class='footer-links'>
        <div className='footer-link-wrapper'>
          <div class='footer-link-items'>
            <h2>Contacts</h2>
            <p class='para1'> 
                Thank you for having a look through my website! Feel free to contact me by means of linkedIn
            </p>
          </div>
        </div>

        <div className='footer-link-wrapper'>
          <div class='footer-link-items'>
            <h2>Social Media</h2>
            <Link to='https://www.instagram.com/achita_a_/'>Instagram</Link>
            <Link to='https://www.linkedin.com/in/achita-ananta/'>LinkedIn</Link>
            <Link to='https://www.youtube.com/channel/UCKs9vmrkEwcfqnIEKUPPA0w'>Youtube</Link>
          </div>
        </div>
      </div>
      <section class='social-media'>

        <div class='social-media-wrap'>
          <div class='footer-logo'>
            <Link to='/' className='social-logo'>
              Achita
              <i class='fab fa-typo3' />
            </Link>
          </div>

          <small class='website-rights'>Achita © 2024</small>
          <div class='social-icons'>
            <Link
              class='social-icon-link instagram'
              to='https://www.instagram.com/achita_a_/'
              target='_blank'
              aria-label='Instagram'
            >
              <i class='fab fa-instagram' />
            </Link>

            <Link
              class='social-icon-link youtube'
              to='https://www.youtube.com/channel/UCKs9vmrkEwcfqnIEKUPPA0w'
              target='_blank'
              aria-label='Youtube'
            >
              <i class='fab fa-youtube' />
            </Link>

            <Link
              class='social-icon-link linkedin'
              to='https://www.linkedin.com/in/achita-ananta/'
              target='_blank'
              aria-label='LinkedIn'
            >
              <i class='fab fa-linkedin' />
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;