import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './TopBanner.scss';


export default class TopBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { loggedIn } = this.props;
    return (
      <Navbar id="banner" expand='sm'>
        <Navbar.Brand>
          <h1 id="banner-title">Supersonic</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        {loggedIn &&
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link>
                <button className='navbar-button'>
                  <Link className='home-link' to="/">Home</Link>
                </button>
              </Nav.Link>
              <Nav.Link>
                <button className='navbar-button' onClick={this.props.handleLogout}>logout</button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        }


      </Navbar>
    )
  }
}