// import libraries
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";

// import actions
// no actions needed for this element

// import necessary components
// import SomeComponent from '../components/SomeComponent';
import PracticePage from '../PracticePage/PracticePage';
import SettingsPage from '../SettingsPage/SettingsPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import StatsPage from '../StatsPage/StatsPage';
// import stylesheet
import './HomePage.scss';

class HomePage extends React.Component {

  render() {
    return (
      <div id="home-page">
        <div id="home-page__banner">
          <h1 id="home-page__title">Supersonic</h1>
        </div>
        <div id="home-page__content">
          <div id="home-page__content__info">
            <h2 id="home-page__subtitle">Fined-tuned ear training</h2>
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
          <button className="logout-button" onClick={this.props.handleLogout}>logout</button>
        </div>


      </div >

    )
  }
}

// Add anything needed in this component from the global state
let mapStateToProps = state => {
  return {
    userData: state.userData,
  }
}

// The second parameter object contains the state actions we imported at the top
export default connect(mapStateToProps, null)(HomePage);
