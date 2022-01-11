// import libraries
import React from 'react';

// import actions
// no actions needed for this element

// import necessary components
// import SomeComponent from '../components/SomeComponent';
/* ---------------------- */

// import stylesheet
import './PracticeOptionsMenu.scss';

export default class PracticeOptionsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: 'MEDIUM',
      interval: 'PERFECT-5TH',
      fixedStartNote: 'FIXED-FALSE',
      startNote: 'A4',
    }
  }

  componentDidMount() {
    document.getElementById(`${this.state.difficulty}`).classList.add('active');
    document.getElementById(`${this.state.interval}`).classList.add('active');
    document.getElementById(`${this.state.fixedStartNote}`).classList.add('active');
  }

  clickInterval(value) {
    // updates the interval setting in state
    // updates the UI accordingly
    this.setState({ interval: value });
    document.querySelectorAll('.practice-setup__interval__button')
      .forEach(elem => { elem.classList.remove('active') });
    document.getElementById(`${value}`).classList.add('active');
  }

  clickFixedStartNote(value) {
    // updates the fixedStartNote setting in state
    // updates the UI accordingly
    this.setState({ fixedStartNote: value });
    document.querySelectorAll('.practice-setup__fixed-start-note__button')
      .forEach(elem => { elem.classList.remove('active') });
    document.getElementById(`${value}`).classList.add('active');
  }

  clickStartNote(value) {
    // updates the startNote setting in state
    // updates the UI accordingly
    this.setState({ startNote: value });
    document.querySelectorAll('.practice-setup__start-note__button')
      .forEach(elem => { elem.classList.remove('active') });
    document.getElementById(`${value}`).classList.add('active');

  }

  render() {
    const { fixedStartNote } = this.state;
    return (
      <div className="practice-setup">
        <h2>Setup</h2>
        <div className="practice-setup__difficulty">
          <h3 className="practice-setup__category-header">Difficulty</h3>
          <button className="practice-setup__difficulty__button" id="EASY">Easy</button>
          <button className="practice-setup__difficulty__button" id="MEDIUM">Medium</button>
          <button className="practice-setup__difficulty__button" id="HARD">Hard</button>
        </div>
        <div className="practice-setup__interval">
          <h3 className="practice-setup__category-header">Interval</h3>
          <button className="practice-setup__interval__button" id="UNISON" onClick={() => this.clickInterval('UNISON')}>Unison</button>
          <button className="practice-setup__interval__button" id="MINOR-2ND" onClick={() => this.clickInterval('MINOR-2ND')}>Minor 2nd</button>
          <button className="practice-setup__interval__button" id="MAJOR-2ND" onClick={() => this.clickInterval('MAJOR-2ND')}>Major 2nd</button>
          <button className="practice-setup__interval__button" id="MINOR-3RD" onClick={() => this.clickInterval('MINOR-3RD')}>Minor 3rd</button>
          <button className="practice-setup__interval__button" id="MAJOR-3RD" onClick={() => this.clickInterval('MAJOR-3RD')}>Major 3rd</button>
          <button className="practice-setup__interval__button" id="PERFECT-4TH" onClick={() => this.clickInterval('PERFECT-4TH')}>Perfect 4th</button>
          <button className="practice-setup__interval__button" id="TRITONE" onClick={() => this.clickInterval('TRITONE')}>Tritone</button>
          <button className="practice-setup__interval__button" id="PERFECT-5TH" onClick={() => this.clickInterval('PERFECT-5TH')}>Perfect 5th</button>
          <button className="practice-setup__interval__button" id="MINOR-6TH" onClick={() => this.clickInterval('MINOR-6TH')}>Minor 6th</button>
          <button className="practice-setup__interval__button" id="MAJOR-6TH" onClick={() => this.clickInterval('MAJOR-6TH')}>Major 6th</button>
          <button className="practice-setup__interval__button" id="MINOR-7TH" onClick={() => this.clickInterval('MINOR-7TH')}>Minor 7th</button>
          <button className="practice-setup__interval__button" id="MAJOR-7TH" onClick={() => this.clickInterval('MAJOR-7TH')}>Major 7th</button>
          <button className="practice-setup__interval__button" id="OCTAVE" onClick={() => this.clickInterval('OCTAVE')}>Octave</button>
        </div>
        <div className="practice-setup__fixed-start-note">
          <h3 className="practice-setup__category-header">Fixed start note</h3>
          <button className="practice-setup__fixed-start-note__button" id="FIXED-TRUE" onClick={() => this.clickFixedStartNote('FIXED-TRUE')}>Yes</button>
          <button className="practice-setup__fixed-start-note__button" id="FIXED-FALSE" onClick={() => this.clickFixedStartNote('FIXED-FALSE')}>No</button>
        </div>
        {fixedStartNote === 'FIXED-TRUE' &&
          <div className="practice-setup__start-note">
            <h3 className="practice-setup__category-header">Start note</h3>
            <button className="practice-setup__start-note__button white-key" id="A3" onClick={() => this.clickStartNote('A3')}>A3</button>
            <button className="practice-setup__start-note__button black-key" id="Bb3" onClick={() => this.clickStartNote('Bb3')}>Bb3</button>
            <button className="practice-setup__start-note__button white-key" id="B3" onClick={() => this.clickStartNote('B3')}>B3</button>
            <button className="practice-setup__start-note__button white-key" id="C4" onClick={() => this.clickStartNote('C4')}>C4</button>
            <button className="practice-setup__start-note__button black-key" id="Db4" onClick={() => this.clickStartNote('Db4')}>Db4</button>
            <button className="practice-setup__start-note__button white-key" id="D4" onClick={() => this.clickStartNote('D4')}>D4</button>
            <button className="practice-setup__start-note__button black-key" id="Eb4" onClick={() => this.clickStartNote('Eb4')}>Eb4</button>
            <button className="practice-setup__start-note__button white-key" id="E4" onClick={() => this.clickStartNote('E4')}>E4</button>
            <button className="practice-setup__start-note__button white-key" id="F4" onClick={() => this.clickStartNote('F4')}>F4</button>
            <button className="practice-setup__start-note__button black-key" id="Gb4" onClick={() => this.clickStartNote('Gb4')}>Gb4</button>
            <button className="practice-setup__start-note__button white-key" id="G4" onClick={() => this.clickStartNote('G4')}>G4</button>
            <button className="practice-setup__start-note__button black-key" id="Ab4" onClick={() => this.clickStartNote('Ab4')}>Ab4</button>
            <button className="practice-setup__start-note__button white-key" id="A4" onClick={() => this.clickStartNote('A4')}>A4</button>
            <button className="practice-setup__start-note__button black-key" id="Bb4" onClick={() => this.clickStartNote('Bb4')}>Bb4</button>
            <button className="practice-setup__start-note__button white-key" id="B4" onClick={() => this.clickStartNote('B4')}>B4</button>
            <button className="practice-setup__start-note__button white-key" id="C5" onClick={() => this.clickStartNote('C5')}>C5</button>
            <button className="practice-setup__start-note__button black-key" id="Db5" onClick={() => this.clickStartNote('Db5')}>Db5</button>
            <button className="practice-setup__start-note__button white-key" id="D5" onClick={() => this.clickStartNote('D5')}>D5</button>
            <button className="practice-setup__start-note__button black-key" id="Eb5" onClick={() => this.clickStartNote('Eb5')}>Eb5</button>
            <button className="practice-setup__start-note__button white-key" id="E5" onClick={() => this.clickStartNote('E5')}>E5</button>
            <button className="practice-setup__start-note__button white-key" id="F5" onClick={() => this.clickStartNote('F5')}>F5</button>
            <button className="practice-setup__start-note__button black-key" id="Gb5" onClick={() => this.clickStartNote('Gb5')}>Gb5</button>
            <button className="practice-setup__start-note__button white-key" id="G5" onClick={() => this.clickStartNote('G5')}>G5</button>
            <button className="practice-setup__start-note__button black-key" id="Ab5" onClick={() => this.clickStartNote('Ab5')}>Ab5</button>
            <button className="practice-setup__start-note__button white-key" id="A5" onClick={() => this.clickStartNote('A5')}>A5</button>
          </div>

        }
        <button onClick={() => this.props.confirmSetupOptions(this.state)}>Practice</button>
      </div>

    )
  }
}

