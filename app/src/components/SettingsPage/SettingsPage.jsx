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
      noteDuration: { name: 'MEDIUM', value: 1000 },
      soundWaveType: 'sine',
      practiceStyle: { name: 'MELODIC', value: false},
    };

    // Try to pull settings from localStorage, uses defaults if not found
    let settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;

    this.state = {
      settings: {
        noteDuration: settings.noteDuration,
        soundWaveType: settings.soundWaveType,
      }
    };
  }

  componentDidMount() {
    document.getElementById(`${this.state.settings.noteDuration.name}-button`).classList.add('active');
    document.getElementById(`${this.state.settings.soundWaveType}-button`).classList.add('active');
  }

  clickNoteDuration(value) {
    // updates the noteDuration setting in localStorage
    // updates the UI accordinly
    this.updateSettings('noteDuration', value);

    document.querySelectorAll('.settings__note-duration__button')
      .forEach(elem => { elem.classList.remove('active') });
    document.getElementById(`${value.name}-button`).classList.add('active');
  }

  clickSoundWaveType(value) {
    // updates the soundWaveType setting in localStorage
    // updates the UI accordingly
    this.updateSettings('soundWaveType', value);

    document.querySelectorAll('.settings__sound-wave-button')
      .forEach(elem => { elem.classList.remove('active') });
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
    const short = { name: 'SHORT', value: 500 };
    const medium = { name: 'MEDIUM', value: 1000 };
    const long = { name: 'LONG', value: 2000 };

    return (
      <div className="settings">
        <h1 className="settings__title">Settings</h1>
        <div className="settings__note-duration">
          <p className="settings__label">Note duration:</p>
          <button onClick={() => { this.clickNoteDuration(short) }}
            className="settings__note-duration__button"
            id="SHORT-button">short</button>
          <button onClick={() => { this.clickNoteDuration(medium) }}
            className="settings__note-duration__button"
            id="MEDIUM-button">medium</button>
          <button onClick={() => { this.clickNoteDuration(long) }}
            className="settings__note-duration__button"
            id="LONG-button">long</button>
        </div>
        <div className="settings__sound-wave-type">
          <p className="settings__label">Sound wave type</p>
          <button onClick={() => { this.clickSoundWaveType("sine") }}
            className="settings__sound-wave-button"
            id="sine-button">sine</button>
          <button onClick={() => { this.clickSoundWaveType("square") }}
            className="settings__sound-wave-button"
            id="square-button">square</button>
          <button onClick={() => { this.clickSoundWaveType("sawtooth") }}
            className="settings__sound-wave-button"
            id="sawtooth-button">sawtooth</button>
        </div>
        <button onClick={() => { history.back() }}
          className="settings__back-button">Back</button>

      </div>

    )
  }
}
