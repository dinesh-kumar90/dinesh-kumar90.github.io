import { useState } from 'react';
import ScrollAnimation from 'react-animate-on-scroll';
import Header from './components/Header';
import './App.css';
import Banner from './components/Banner';
import About from './components/About';
import Work from './components/Work';
import Contact from './components/Contact';

function App() {
  return (
    <div className='App'>
      <Header />
      <Banner />
      <About />
      <Work />
      <Contact />
    </div>
  );
}

export default App;
