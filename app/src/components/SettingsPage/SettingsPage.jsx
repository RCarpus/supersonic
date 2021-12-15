// import libraries
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// import actions
import { setUserData } from '../../actions/actions';

// import necessary components
// import SomeComponent from '../components/SomeComponent';
/* ---------------------- */

// import stylesheet
import './SettingsPage.scss';

// import mockUserData
import { mockUserData } from '../../mock-userData';
setUserData(mockUserData);

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteDuration: mockUserData.Settings.NoteDuration,
      soundWaveType: mockUserData.Settings.SoundWaveType,
      practiceStyle: mockUserData.Settings.PracticeStyle
    };
  }

  componentDidMount() {
    document.getElementById(`${this.state.noteDuration}-button`).classList.add('active');
    document.getElementById(`${this.state.soundWaveType}-button`).classList.add('active');
    document.getElementById(`${this.state.practiceStyle}-button`).classList.add('active');
  }

  clickNoteDuration(value) {
    this.setState({ noteDuration: value });
    document.getElementById('SHORT-button').classList.remove('active');
    document.getElementById('MEDIUM-button').classList.remove('active');
    document.getElementById('LONG-button').classList.remove('active');
    document.getElementById(`${value}-button`).classList.add('active');
  }

  clickSoundWaveType(value) {
    this.setState({ soundWaveType: value });
    document.getElementById('SINE-button').classList.remove('active');
    document.getElementById('SQUARE-button').classList.remove('active');
    document.getElementById('SAWTOOTH-button').classList.remove('active');
    document.getElementById(`${value}-button`).classList.add('active');
    console.log(`clicked ${value}`); 
  }

  clickPracticeStyle(value) {
    this.setState({ practiceStyle: value });
    document.getElementById('MELODIC-button').classList.remove('active');
    document.getElementById('HARMONIC-button').classList.remove('active');
    document.getElementById(`${value}-button`).classList.add('active');
    console.log(`clicked ${value}`); 
  }

  clickSaveSettings() {
    // Send a PUT request to the server
    // Save results into new userData
    // this.props.setUserData(response.data);
    console.log('Saved settings (for pretend)');
  }


  render() {
    const { settings } = this.props;
    return (
      <div className="settings">
        <h2 className="settings__title">Settings</h2>
        <div className="settings__note-duration">
          <p className="settings__note-duration__label">Note duration:</p>
          <button onClick={ () => { this.clickNoteDuration("SHORT")} } 
                  className="settings__note-duration__button"
                  id="SHORT-button">short</button>
          <button onClick={ () => {  this.clickNoteDuration("MEDIUM")} } 
                  className="settings__note-duration__button"
                  id="MEDIUM-button">medium</button>
          <button onClick={ () => { this.clickNoteDuration("LONG")}} 
                  className="settings__note-duration__button"
                  id="LONG-button">long</button>
        </div>
        <div className="settings__sound-wave-type">
          <p className="settings__sound-wave-type__label">Sound wave type</p>
          <button onClick={ () => { this.clickSoundWaveType("SINE")} } 
                  className="settings__sound-wave-button"
                  id="SINE-button">sine</button>
          <button onClick={ () => { this.clickSoundWaveType("SQUARE")} } 
                  className="settings__sound-wave-button"
                  id="SQUARE-button">square</button>
          <button onClick={ () => { this.clickSoundWaveType("SAWTOOTH")} } 
                  className="settings__sound-wave-button"
                  id="SAWTOOTH-button">sawtooth</button>
        </div>
        <div className="settings__practice-style">
          <p className="settings__practice-style__label">Practice style:</p>
          <button onClick={ () => { this.clickPracticeStyle("MELODIC")} }
                  className="settings__practice-style__button"
                  id="MELODIC-button">melodic</button>
          <button onClick={ () => { this.clickPracticeStyle("HARMONIC")} }
                  className="settings__practice-style__button"
                  id="HARMONIC-button">harmonic</button>
        </div>
        <button onClick={ this.clickSaveSettings }
                className="settings__save-settings-button">Save</button>
        <button onClick={ () => {history.back()} }
                className="settings__back-button">Back</button>

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
export default connect(mapStateToProps, { setUserData })(SettingsPage);
