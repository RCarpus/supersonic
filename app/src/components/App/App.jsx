// import libraries
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// import actions
import { setUserData } from '../../actions/actions';

// import necessary components
import HomePage from '../HomePage/HomePage';
import PracticePage from '../PracticePage/PracticePage';
import SettingsPage from '../SettingsPage/SettingsPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import StatsPage from '../StatsPage/StatsPage';
import LandingPage from '../LandingPage/LandingPage';

// import stylesheet
import './App.scss';

// import mockUserData
import { mockUserData } from '../../mock-userData';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: undefined
    }
  };

  componentDidMount() {
    /**
     * Log the user in when the app loads.
     * If there is no saved token, the user is taken to the landing page.
     */
    this.handleLogin();
  }

  handleLogin() {
    /**
     * Pulls the token from localStorage.
     * If there is a token, sets the state to logged in.
     * This function is called when the app mounts or when the user logs in
     */
    const token = localStorage.getItem('token');
    if (token) {
      this.setState({ loggedIn: true });
    }
  }

  render() {
    const { loggedIn } = this.state;

    // If the user is not logged in, they should be forced to see the landing page
    if (!loggedIn) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage handleLogin={() => this.handleLogin()}/>} />
            <Route path="/profile" element={<LandingPage handleLogin={() => this.handleLogin()}/>} />
            <Route path="/settings" element={<LandingPage handleLogin={() => this.handleLogin()}/>} />
            <Route path="/practice" element={<LandingPage handleLogin={() => this.handleLogin()}/>} />
            <Route path="/stats" element={<LandingPage handleLogin={() => this.handleLogin()}/>} />
          </Routes>
        </BrowserRouter>
      )

    }

    return (
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/stats" element={<StatsPage />} />

        </Routes>
      </BrowserRouter>

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
export default connect(mapStateToProps, { setUserData })(App);
