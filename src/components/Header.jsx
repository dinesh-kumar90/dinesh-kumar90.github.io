import React from 'react';
import { Navbar, Container, Nav, Offcanvas } from 'react-bootstrap';
import { Link, animateScroll as scroll } from 'react-scroll';

export default function Header() {
  return (
    <header>
      <Navbar bg='light' expand='lg'>
        <Container>
          <Navbar.Brand href='#home' className='heading-font logo'>
            Dinesh Kumar
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='offcanvasNavbar' />
          <Navbar.Offcanvas
            id='offcanvasNavbar'
            aria-labelledby='offcanvasNavbarLabel'
            placement='end'>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id='offcanvasNavbarLabel'>
                Dinesh Kumar
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className='justify-content-end flex-grow-1 pe-3'>
                <Link
                  activeClass='active'
                  className='nav-link'
                  to='about'
                  spy={true}
                  smooth={true}
                  offset={-180}
                  duration={500}
                  aria-label='Close'>
                  About
                </Link>
                <Link
                  activeClass='active'
                  className='nav-link'
                  to='work'
                  spy={true}
                  smooth={true}
                  offset={-180}
                  duration={500}>
                  Work
                </Link>
                <Link
                  activeClass='active'
                  className='nav-link'
                  to='contact'
                  spy={true}
                  smooth={true}
                  offset={-180}
                  duration={500}>
                  Contact
                </Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <Navbar.Collapse id='basic-navbar-nav' className='d-none d-lg-flex'>
            <Nav className='justify-content-end flex-grow-1 pe-3'>
              {/* <Nav.Link href='#about'>About</Nav.Link>
              <Nav.Link href='#work'>Work</Nav.Link>
              <Nav.Link href='#contact'>Contact</Nav.Link> */}
              <Link
                activeClass='active'
                className='nav-link'
                to='about'
                spy={true}
                smooth={true}
                offset={-180}
                duration={500}>
                About
              </Link>
              <Link
                activeClass='active'
                className='nav-link'
                to='work'
                spy={true}
                smooth={true}
                offset={-180}
                duration={500}>
                Work
              </Link>
              <Link
                activeClass='active'
                className='nav-link'
                to='contact'
                spy={true}
                smooth={true}
                offset={-180}
                duration={500}>
                Contact
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
