// import libraries
import React from 'react';
import { connect } from 'react-redux';


// import necessary components
// import SomeComponent from '../components/SomeComponent';
import TrainingSession from '../TrainingSession/TrainingSession';
import PracticeOptionsMenu from '../practice-options-menu/PracticeOptionsMenu';
/* ---------------------- */

// import stylesheet

export default class PracticePage extends React.Component {
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
        numReps: { name: 'reps-10', value: 10},
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
        {!setupComplete && <PracticeOptionsMenu options={this.state.options}
          confirmSetupOptions={(options) => this.confirmSetupOptions(options)} />}
        {setupComplete && <TrainingSession options={this.state.options}
          returnToSetup={() => this.returnToSetup()}
        />}

      </div>

    )
  }
}
