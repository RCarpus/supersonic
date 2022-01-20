// import libraries
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Container } from 'react-bootstrap';

// import actions
import { setUserData } from '../../actions/actions';

// import necessary components
import HomePage from '../HomePage/HomePage';
import PracticePage from '../PracticePage/PracticePage';
import SettingsPage from '../SettingsPage/SettingsPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import StatsPage from '../StatsPage/StatsPage';
import LandingPage from '../LandingPage/LandingPage';
import TopBanner from '../TopBanner/TopBanner';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

// import stylesheet
import './App.scss';

// import mockUserData
import { mockUserData } from '../../mock-userData';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: undefined,
      loading: false,
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
     * If there is a token, checks the token to make sure it is valid.
     * If the token is valid, loggedIn is set to true.
     * This function is called when the app mounts or when the user logs in
     */
    this.setState({ loading: true }, () => {
      const token = localStorage.getItem('token');
      if (token) {
        let parsedToken = JSON.parse(token);
        const authHeader = { headers: { Authorization: `Bearer ${parsedToken}` } };
        axios.get('https://supersonic-api.herokuapp.com/checktoken', authHeader)
          .then(response => {
            this.setState({ loggedIn: true, loading: false });
            return response;
          })
          .catch(e => {
            console.log('invalid token. Maybe it expired.');
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            this.setState({ loggedIn: false, loading: false });
            return false;
          });
      } else {
        this.setState({ loggedIn: false, loading: false });
      }
    })

  }

  handleLogout() {
    /**
     * Removes the token and userData from localStorage.
     * Then calls handleLogin, which will fail to find credentials
     * and bring the user to the landing page.
     */
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.handleLogin();
  }

  render() {
    const { loggedIn, loading } = this.state;

    // If the user is not logged in, they should be forced to see the landing page
    if (!loggedIn) {
      return (
        <HashRouter>
          <TopBanner loggedIn={loggedIn} handleLogout={() => this.handleLogout()} />
          {loading && <LoadingIndicator /> }
          <Container>
            <Routes>
              <Route path="/" element={<LandingPage handleLogin={() => this.handleLogin()} />} />
              <Route path="/profile" element={<LandingPage handleLogin={() => this.handleLogin()} />} />
              <Route path="/settings" element={<LandingPage handleLogin={() => this.handleLogin()} />} />
              <Route path="/practice" element={<LandingPage handleLogin={() => this.handleLogin()} />} />
              <Route path="/stats" element={<LandingPage handleLogin={() => this.handleLogin()} />} />
            </Routes>
          </Container>
        </HashRouter>
      )

    }

    return (
      <HashRouter>
        <TopBanner loggedIn={loggedIn} handleLogout={() => this.handleLogout()} />
        {loading && <LoadingIndicator /> }
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Container>
      </HashRouter>

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
