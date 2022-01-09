import React from 'react';
import { Container } from 'react-bootstrap';

export default function About() {
  return (
    <div className='section primary-bg-color' id='about'>
      <Container>
        <div className='section-header'>
          <h3 className='text-center primary-color heading'>About Me</h3>
        </div>
        <div className='section-content'>
          <p>A full-stack software engineer with over 8 years of experience.</p>
          <p>
            I have maintained, developed and launched multiple projects from
            scratch, carrying the development of its' back-end and front-end
            codebases.
          </p>
          <p>
            My current toolset includes PHP, Laravel, JavaScript & TypeScript
            (Node.js as well), Vue.Js, React, Redux, Shopify and all the other
            various frameworks, libraries and technologies related to them.
          </p>
          <p>I can help you with all the sides of your project:</p>
          <ul>
            <li>verifying good UI/UX design,</li>
            <li>leading/co-developing the back-end and front-end,</li>
            <li>Shopify theme/Shopify app developement</li>
            <li>mentoring the team,</li>
            <li>estimating tasks,</li>
            <li>leading, launching and monitoring the project.</li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
