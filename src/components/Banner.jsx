import React, { useState } from 'react';
import ScrollAnimation from 'react-animate-on-scroll';
import { Container } from 'react-bootstrap';
import bannerImage from '../assets/images/banner.jpg';

export default function Banner() {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <section id='banner'>
      <div className='banner-image'>
        <img
          src={bannerImage}
          alt='Banner Image'
          onLoad={() => {
            setImageLoaded(true);
            console.log('image loaded');
          }}
        />
        {!imageLoaded ? (
          <div
            style={{
              height: '600px',
              backgroundColor: '#FFFFFF',
              display: 'inline-block',
            }}
          />
        ) : (
          ''
        )}
      </div>
      <Container>
        <div className='banner-text'>
          <ScrollAnimation
            animateIn='bounceInLeft'
            animateOut='bounceOutLeft'
            scrollableParentSelector='#banner'>
            <h2 className='heading'>
              Hello, my name is{' '}
              <span className='primary-color'>Dinesh Kumar</span>
            </h2>
            <h5 className='sub-heading'>I am a fullstack developer</h5>
          </ScrollAnimation>
        </div>
      </Container>
    </section>
  );
}
