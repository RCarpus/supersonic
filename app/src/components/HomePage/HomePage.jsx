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
            <Link to='/practice' className="home-page__link link-big">
              Practice
            </Link>
            <Link to='/stats' className="home-page__link">
              Stats
            </Link>
            <Link to='/settings' className="home-page__link">
              Settings
            </Link>
            <Link to='/profile' className="home-page__link">
              Profile
            </Link>
          </div>
        </div>
        <Footer />
      </div >
    )
  }
}