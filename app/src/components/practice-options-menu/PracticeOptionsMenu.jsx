// import libraries
import React from 'react';

// import stylesheet
import './PracticeOptionsMenu.scss';

export default class PracticeOptionsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: props.options.difficulty,
      interval: props.options.interval,
      fixedStartNote: props.options.fixedStartNote,
      startNote: props.options.startNote,
      direction: props.options.direction,
      numReps: props.options.numReps,
      showInstructions: false,
    }
  }

  componentDidMount() {
    document.getElementById(`${this.state.difficulty}`).classList.add('active');
    document.getElementById(`${this.state.interval}`).classList.add('active');
    document.getElementById(`${this.state.fixedStartNote}`).classList.add('active');
    document.getElementById(`${this.state.direction}`).classList.add('active');
    document.getElementById(`${this.state.numReps.name}`).classList.add('active');
  }

  clickDifficulty(value) {
    // updates the difficulty setting in state
    // updates the UI accordingly
    this.setState({ difficulty: value });
    document.querySelectorAll('.practice-setup__difficulty__button')
      .forEach(elem => { elem.classList.remove('active') });
    document.getElementById(`${value}`).classList.add('active');
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

  clickDirection(value) {
    // updates the direction value in state
    // updates the UI accordingly
    this.setState({ direction: value });
    document.querySelectorAll('.practice-setup__direction__button')
      .forEach(elem => { elem.classList.remove('active') });
    document.getElementById(`${value}`).classList.add('active');
  }

  clickNumReps(value) {
    // updates the numReps value in state
    // updates the UI accordingly
    this.setState({ numReps: value });
    document.querySelectorAll('.practice-setup__num-reps__button')
      .forEach(elem => { elem.classList.remove('active') });
    document.getElementById(`${value.name}`).classList.add('active');
  }

  showInstructions() {
    document.querySelectorAll('.instructions')
      .forEach(elem => { elem.classList.add('show-instructions') });
    this.setState({ showInstructions: true });
  }

  hideInstructions() {
    document.querySelectorAll('.instructions')
      .forEach(elem => { elem.classList.remove('show-instructions') });
    this.setState({ showInstructions: false });
  }

  render() {
    const { fixedStartNote, showInstructions } = this.state;
    return (
      <div className="practice-setup">
        <h1>Practice Setup</h1>
        {showInstructions && <button id="hide-instructions-button" onClick={() => this.hideInstructions()}>Hide Instructions</button>}
        {!showInstructions && <button id="show-instruction-button" onClick={() => this.showInstructions()}>Show Instructions</button>}
        
        <div className="practice-setup__difficulty">
          <h3 className="practice-setup__category-header">Difficulty</h3>
          <p className="instructions">How out of tune the notes might be. Ranges from 50 cents (easy) to 25 cents (medium) to 10 cents (hard).</p>
          <button className="practice-setup__difficulty__button" id="EASY" onClick={() => this.clickDifficulty('EASY')}>Easy</button>
          <button className="practice-setup__difficulty__button" id="MEDIUM" onClick={() => this.clickDifficulty('MEDIUM')}>Medium</button>
          <button className="practice-setup__difficulty__button" id="HARD" onClick={() => this.clickDifficulty('HARD')}>Hard</button>
        </div>
        <div className="practice-setup__interval">
          <h3 className="practice-setup__category-header">Interval</h3>
          <p className="instructions">This is the interval you'll be practicing with. If you don't already know what this means, you might want to <a href="https://en.wikipedia.org/wiki/Interval_(music)" target="_blank"> do some research</a> and come back later.</p>
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
        <div className="practice-setup__direction">
          <h3 className="practice-setup__category-header">Direction</h3>
          <p className="instructions">Unless you choose "Simultaneous", you'll hear two notes in sucession. This will determine if the second note will be higher or lower than the first. The first note you hear will always be in tune. The second note is the one that might be out of tune. If you choose "simultaneous", the top note is the one you want to listen for.</p>
          <button className="practice-setup__direction__button" id="ASCENDING" onClick={() => this.clickDirection('ASCENDING')}>Ascending</button>
          <button className="practice-setup__direction__button" id="DESCENDING" onClick={() => this.clickDirection('DESCENDING')}>Descending</button>
          <button className="practice-setup__direction__button" id="BOTH" onClick={() => this.clickDirection('BOTH')}>Both</button>
          <button className="practice-setup__direction__button" id="SIMULTANEOUS" onClick={() => this.clickDirection('SIMULTANEOUS')}>Simultaneous</button>
        </div>
        <div className="practice-setup__fixed-start-note">
          <h3 className="practice-setup__category-header">Fixed start note</h3>
          <p className="instructions">If you choose yes, you will get to choose any note in a two octave range to start all of your intervals from. Otherwise, the starting note will be random. If you're not very confident in your ears yet, you probably want to use a fixed start note until you get the hang of things. This will help keep you keep a solid orientation of the base note in your mind.</p>
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
        <div className="practice-setup__num-reps">
          <h3 className="practice-setup__category-header">Number of reps</h3>
          <p className="instructions">How long do you want to do this for? I've got all day, so it's up to you.</p>
          <button className="practice-setup__num-reps__button" id="reps-5" onClick={() => this.clickNumReps({name: 'reps-5', value: 5})}>5</button>
          <button className="practice-setup__num-reps__button" id="reps-10" onClick={() => this.clickNumReps({name: 'reps-10', value: 10})}>10</button>
          <button className="practice-setup__num-reps__button" id="reps-20" onClick={() => this.clickNumReps({name: 'reps-20', value: 20})}>20</button>
          <button className="practice-setup__num-reps__button" id="reps-50" onClick={() => this.clickNumReps({name: 'reps-50', value: 50})}>50</button>
        </div>
        <button id="begin-practice-button" onClick={() => this.props.confirmSetupOptions(this.state)}>Begin Practice</button>
      </div>

    )
  }
}

