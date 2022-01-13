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

// import stylesheet
import './App.scss';

// import mockUserData
import { mockUserData } from '../../mock-userData';

class App extends React.Component {

  constructor(props) {
    super(props);
  };

  componentDidMount() {
    this.props.setUserData(mockUserData);
  }

  render() {
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
