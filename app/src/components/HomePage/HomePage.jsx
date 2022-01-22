// import libraries
import React from 'react';
import { Link } from "react-router-dom";

// import necessary components
import Footer from '../Footer/Footer';
// import stylesheet
import './HomePage.scss';

export default class HomePage extends React.Component {

  render() {
    return (
      <div id="home-page">
        <div id="home-page" className="page-content">
          <div id="home-page__content__info">
            <h2 id="home-page__subtitle">fine-tuned ear training</h2>
            <p>By Ryan Carpus</p>
          </div>
          <div id="home-page__button-grid">
            <Link to='/practice'>
              <button className="home-page__button">Practice</button>
            </Link>
            <Link to='/profile'>
              <button className="home-page__button">Profile</button>
            </Link>
            <Link to='/stats'>
              <button className="home-page__button">Stats</button>
            </Link>
            <Link to='/settings'>
              <button className="home-page__button">Settings</button>
            </Link>
          </div>
        </div>
        <Footer />
      </div >
    )
  }
}