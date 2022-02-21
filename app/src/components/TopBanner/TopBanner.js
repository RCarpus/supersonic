import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
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

        {loggedIn &&
          <>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav className='ms-auto'>
                <Link className='nav-link' to="/">Home</Link>
                <button className='nav-link' onClick={this.props.handleLogout}>logout</button>
              </Nav>
            </Navbar.Collapse>
          </>
        }
      </Navbar>
    )
  }
}