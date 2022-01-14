// import libraries
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// import actions
// no actions needed for this element

// import necessary components
// import SomeComponent from '../components/SomeComponent';
import TrainingSession from '../TrainingSession/TrainingSession';
import PracticeOptionsMenu from '../practice-options-menu/PracticeOptionsMenu';
/* ---------------------- */

// import stylesheet

class PracticePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setupComplete: false,
      options: {
        difficulty: 'MEDIUM',
        interval: 'PERFECT-5TH',
        fixedStartNote: 'FIXED-FALSE',
        startNote: 'A4',
        direction: 'ASCENDING',
      },
    }
  }

  confirmSetupOptions(options) {
    /**
     * Saves the training setup options into state. 
     * This method is called from PracticeOptionsMenu
     */
    this.setState({ options, setupComplete: true });
  }

  returnToSetup() {
    /**
     * Returns the user to the practice setup view.
     * This is done by changing the setupComplete value in state to false.
     * The app should remember the practice setup options used the previous time.
     */
    this.setState({ setupComplete: false });
  }

  render() {
    const { setupComplete } = this.state;
    return (
      <div>
        <button className="logout-button" onClick={this.props.handleLogout}>logout</button>
        {!setupComplete && <PracticeOptionsMenu options={this.state.options}
          confirmSetupOptions={(options) => this.confirmSetupOptions(options)} />}
        {setupComplete && <TrainingSession options={this.state.options}
          returnToSetup={() => this.returnToSetup()}
        />}

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
export default connect(mapStateToProps, null)(PracticePage);
