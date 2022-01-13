// import libraries
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// import actions
// no actions needed for this element

// import necessary components
// import SomeComponent from '../components/SomeComponent';
/* ---------------------- */

// import stylesheet

class StatsSetupPage extends React.Component {

  render() {
    return (
      <div>
        <button className="logout-button" onClick={this.props.handleLogout}>logout</button>
        <p>This is the Stats page.</p>

      </div>

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
export default connect(mapStateToProps, null)(StatsSetupPage);
