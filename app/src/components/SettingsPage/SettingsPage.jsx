// import libraries
import React from 'react';
import { connect } from 'react-redux';

// import stylesheet
import './SettingsPage.scss';

export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    const defaultSettings = {
      /**
       * Default settings are used when no data is saved in localStorage
       */
      noteDuration: 'MEDIUM',
      soundWaveType: 'SINE',
      practiceStyle: 'MELODIC',
    };

    // Try to pull settings from localStorage, uses defaults if not found
    let settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;

    this.state = {
      settings: {
        noteDuration: settings.noteDuration,
        soundWaveType: settings.soundWaveType,
        practiceStyle: settings.practiceStyle,
      }
    };
  }

  componentDidMount() {
    document.getElementById(`${this.state.settings.noteDuration}-button`).classList.add('active');
    document.getElementById(`${this.state.settings.soundWaveType}-button`).classList.add('active');
    document.getElementById(`${this.state.settings.practiceStyle}-button`).classList.add('active');
  }

  clickNoteDuration(value) {
    // updates the noteDuration setting in localStorage
    // updates the UI accordinly
    this.updateSettings('noteDuration', value);

    document.querySelectorAll('.settings__note-duration__button')
      .forEach(elem => {elem.classList.remove('active')});
    document.getElementById(`${value}-button`).classList.add('active');
  }

  clickSoundWaveType(value) {
    // updates the soundWaveType setting in localStorage
    // updates the UI accordingly
    this.updateSettings('soundWaveType', value);

    document.querySelectorAll('.settings__sound-wave-button')
      .forEach(elem => {elem.classList.remove('active')});
    document.getElementById(`${value}-button`).classList.add('active');
  }

  clickPracticeStyle(value) {
    // updates the practiceStyle setting in localStorage
    // updates the UI accordingly
    this.updateSettings('practiceStyle', value);

    document.querySelectorAll('.settings__practice-style__button')
      .forEach(elem => {elem.classList.remove('active')});
    document.getElementById(`${value}-button`).classList.add('active');
  }

  updateSettings(setting, value) {
    // updates the setting in localStorage
    let updatedSettings = this.state.settings;
    updatedSettings[setting] = value;
    this.setState({ settings: updatedSettings });
    localStorage.setItem('settings', JSON.stringify(this.state.settings));
  }

  render() {
    const { settings } = this.props;
    return (
      <div className="settings">
        <h2 className="settings__title">Settings</h2>
        <div className="settings__note-duration">
          <p className="settings__note-duration__label">Note duration:</p>
          <button onClick={() => { this.clickNoteDuration("SHORT") }}
            className="settings__note-duration__button"
            id="SHORT-button">short</button>
          <button onClick={() => { this.clickNoteDuration("MEDIUM") }}
            className="settings__note-duration__button"
            id="MEDIUM-button">medium</button>
          <button onClick={() => { this.clickNoteDuration("LONG") }}
            className="settings__note-duration__button"
            id="LONG-button">long</button>
        </div>
        <div className="settings__sound-wave-type">
          <p className="settings__sound-wave-type__label">Sound wave type</p>
          <button onClick={() => { this.clickSoundWaveType("SINE") }}
            className="settings__sound-wave-button"
            id="SINE-button">sine</button>
          <button onClick={() => { this.clickSoundWaveType("SQUARE") }}
            className="settings__sound-wave-button"
            id="SQUARE-button">square</button>
          <button onClick={() => { this.clickSoundWaveType("SAWTOOTH") }}
            className="settings__sound-wave-button"
            id="SAWTOOTH-button">sawtooth</button>
        </div>
        <div className="settings__practice-style">
          <p className="settings__practice-style__label">Practice style:</p>
          <button onClick={() => { this.clickPracticeStyle("MELODIC") }}
            className="settings__practice-style__button"
            id="MELODIC-button">melodic</button>
          <button onClick={() => { this.clickPracticeStyle("HARMONIC") }}
            className="settings__practice-style__button"
            id="HARMONIC-button">harmonic</button>
        </div>
        <button onClick={() => { history.back() }}
          className="settings__back-button">Back</button>

      </div>

    )
  }
}
