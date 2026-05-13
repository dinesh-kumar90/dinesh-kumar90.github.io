import React from 'react';
import { Container } from 'react-bootstrap';

export default function Contact() {
  return (
    <div className='section primary-bg-color' id='contact'>
      <Container>
        <div className='section-header'>
          <h3 className='text-center primary-color heading'>Contact Me</h3>
        </div>
        <div className='section-content'>
          <p>
            If you wanna get in touch, talk to me about a project collaboration
            or just say hi,
            <br />
            fill up the awesome form below or send an email to{' '}
            <a
              href='mailto:dinesh.k.thakur@outlook.com'
              className='primary-color'
              style={{ textDecoration: 'none' }}>
              dinesh.k.thakur@outlook.com
            </a>{' '}
            and ~let's talk.
          </p>
        </div>
      </Container>
    </div>
  );
}
