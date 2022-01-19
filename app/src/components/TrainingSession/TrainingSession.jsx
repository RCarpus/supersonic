// import libraries
import React from 'react';
import { notes, intervals, playNote, playNoteSequence, IntervalGroup } from '../../audio-functions';
// import { connect } from 'react-redux';

// import actions

// import necessary components
// import SomeComponent from '../components/SomeComponent';
import ResponseButton from '../response-button/ResponseButton';
import SessionResults from '../SessionResults/SessionResults';
/* ---------------------- */

// import stylesheet
import './TrainingSession.scss';

export default class TrainingSession extends React.Component {
  constructor(props) {
    super(props);

    const defaultSettings = {
      /**
       * Default settings are used when no data is saved in localStorage
       */
      noteDuration: { name: 'MEDIUM', value: 1000 },
      soundWaveType: 'sine',
    };

    // Try to pull settings from localStorage, uses defaults if not found
    let settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;
    this.state = {
      started: false,
      finished: false,
      currentInterval: 0,
      currentCorrectAnswer: undefined, // This is -1, 0, or 1, not to be confused with currentAnswerCorrect
      currentSubmittedAnswer: undefined,
      numIntervals: props.options.numReps.value,
      submittedAnswers: [],
      intervalGroup: undefined,
      currentAnswerCorrect: undefined, // This is boolean, not to be confused with currentCorrectAnswer
      settings: settings,
      showResults: undefined,
      baseNote: 440,
    };
  }

  mapDifficultyToCents(difficulty) {
    /**
     * translates the difficulty from a semantic string to a usable integer
     */
    switch (difficulty) {
      case 'EASY':
        return 50;
      case 'MEDIUM':
        return 25;
      case 'HARD':
        return 10;
      default:
        return 25;
    }
  }

  randomNote() {
    /**
     * Selects a random note and returns the frequency.
     * This function should generate a new base note for the user
     * for each new interval if they are note using a fixed base.
     */
    const numNotes = Object.keys(notes).length;
    const index = Math.floor(numNotes * Math.random());
    const note = notes[Object.keys(notes)[index]];
    return notes[Object.keys(notes)[index]];
  }

  applyRandomDirection(interval) {
    /**
     * Helper function for applyDirectionChoice()
     * Takes in the interval as an integer and applies a random sign to it.
     * This is used when the user has selected "BOTH" directions for intervals
     * returns the integer unchanges if ascending is selected.
     * returns negative integer if descending is selected.
     */
    const direction = Math.random();
    return direction < 0.5 ? -interval : interval;
  }

  applyDirectionChoice(interval) {
    /**
     * Given the user's interval and direction choice,
     * transforms the interval into an ascending or descending interval
     */
    switch (this.props.options.direction) {
      case 'ASCENDING':
        return interval;
      case 'SIMULTANEOUS':
        return interval;
      case 'DESCENDING':
        return - Math.abs(interval);
      case 'BOTH':
        return this.applyRandomDirection(interval);
      default:
        return interval;
    }
  }

  startPractice() {
    /**
     * Starts the practice session.
     * Start by setting started to true.
     * Creates a new intervalGroup and generates the intervals.
     */
    // pull settings from state to put into IntervalGroup object
    let baseNote = this.state.baseNote;
    if (this.props.options.fixedStartNote === 'FIXED-FALSE') {
      baseNote = this.randomNote();
    }

    let interval = this.applyDirectionChoice(this.state.interval);
    let numReps = this.state.numIntervals;

    this.setState({
      started: true,
      finished: false,
      baseNote,
      interval,
      intervalGroup: new IntervalGroup(numReps),
    }, () => {
      this.state.intervalGroup.generateIntervals();
      this.playCurrentInterval();
    });
  }

  playCurrentInterval() {
    /**
     * Plays the current interval taking user settings into account
     */
    let index = this.state.currentInterval;
    let detuneMagnitude = this.state.detuneMagnitude;
    let baseNote = this.state.baseNote;
    let detune;
    const noteDuration = this.state.settings.noteDuration.value;
    const soundWaveType = this.state.settings.soundWaveType;
    const harmonic = this.props.options.direction === 'SIMULTANEOUS' ? true : false;
    let interval = this.state.interval;



    switch (this.state.intervalGroup.intervals[index]) {
      case -1:
        detune = - detuneMagnitude;
        break;
      case 0:
        detune = 0;
        break;
      case 1:
        detune = detuneMagnitude;
        break;
      default:
        detune = 0;
    }
    playNoteSequence(soundWaveType, noteDuration, baseNote, interval, detune, harmonic);
  }

  submitAnswer(answer) {
    /**
     * submits an answer based on whether the user clicked flat, perfect, or sharp
     * 
     * Push the answer to the submittedAnswers.
     * Checks to see if that answer is correct and then notifies the user.
     * A button will render letting them go to the next interval.
     */
    if (this.state.currentAnswerCorrect == null) {
      let index = this.state.currentInterval;
      let updatedSubmittedAnswers = this.state.submittedAnswers;
      updatedSubmittedAnswers.push(answer);
      this.setState({
        submittedAnswers: updatedSubmittedAnswers,
        currentCorrectAnswer: this.state.intervalGroup.intervals[index],
        currentSubmittedAnswer: answer,
      });
      answer === this.state.intervalGroup.intervals[index] ?
        this.setState({ currentAnswerCorrect: true }) :
        this.setState({ currentAnswerCorrect: false });
    }

  }

  nextInterval() {
    /**
     * Takes the user to the next interval when they click the "next" button
     * 
     * Updates the currentInterval in state 
     * and resets currentAnswerCorrect to null.
     */
    let updatedIndex = this.state.currentInterval + 1;
    let baseNote = this.state.baseNote;
    if (this.props.options.fixedStartNote === 'FIXED-FALSE') {
      baseNote = this.randomNote();
    }
    let interval = this.applyDirectionChoice(this.state.interval);
    this.setState({
      currentInterval: updatedIndex,
      baseNote,
      interval,
      currentAnswerCorrect: null,
      currentSubmittedAnswer: null,
    }, () => {
      this.playCurrentInterval();
    });
  }

  handleFinish() {
    this.setState({
      showResults: true,
      currentAnswerCorrect: null,
      started: false,
      finished: true
    });
  }

  handleRestart() {
    /**
     * Brings the user back to the practice setup view. 
     * Practice settings selected before last session should be remembered and pre-selected.
     */
    this.setState({
      started: false,
      finished: false,
      currentInterval: 0,
      currentCorrectAnswer: undefined, // This is -1, 0, or 1, not to be confused with currentAnswerCorrect
      currentSubmittedAnswer: undefined,
      submittedAnswers: [],
      intervalGroup: undefined,
      currentAnswerCorrect: undefined, // This is boolean, not to be confused with currentCorrectAnswer
      showResults: false,
    }, this.props.returnToSetup())
  }

  formatOptionsText(text) {
    /**
     * takes in an option formatted like "PERFECT-5TH"
     * and returns "Perfect 5th"
     */
    let updatedText = text.toLowerCase();
    updatedText = updatedText.slice(0, 1).toUpperCase() + updatedText.slice(1);
    updatedText = updatedText.replace('-', ' ');
    return updatedText;
  }

  render() {
    const { started, finished, currentAnswerCorrect, currentInterval, numIntervals,
      currentCorrectAnswer, currentSubmittedAnswer, showResults } = this.state;
    const lastInterval = currentInterval === numIntervals - 1;
    const intervalText = this.formatOptionsText(this.props.options.interval);
    const difficultyText = this.formatOptionsText(this.props.options.difficulty);
    const directionText = this.formatOptionsText(this.props.options.direction);
    const fixedStartNoteText = this.props.options.fixedStartNote === 'FIXED-FALSE'
      ? 'No'
      : this.props.options.startNote;

    // This object is sent to the SessionResults element for analysis
    let stats;
    if (showResults) {
      stats = {
        reps: this.state.numIntervals,
        submittedAnswers: this.state.submittedAnswers,
        correctAnswers: this.state.intervalGroup.intervals,
        detuneMagnitude: this.state.detuneMagnitude,
        direction: this.props.options.direction,
        difficulty: this.props.options.difficulty,
        fixedStartNote: this.props.options.fixedStartNote,
        interval: this.props.options.interval,
        startNote: this.props.options.startNote,
      }

    }

    return (
      <div id='training-session'>
        {showResults && <SessionResults stats={stats} formatOptionsText={text => this.formatOptionsText(text)} />}

        {!started && !finished &&
          <div>
            <table className="table practice-setup-table">
              <tbody>
                <tr>
                  <th context="row">Practice Type</th>
                  <td>{intervalText}</td>
                </tr>
                <tr>
                  <th context="row">Difficulty</th>
                  <td>{difficultyText}</td>
                </tr>
                <tr>
                  <th context="row">Direction</th>
                  <td>{directionText}</td>
                </tr>
                <tr>
                  <th context="row">Fixed Start Note</th>
                  <td>{fixedStartNoteText}</td>
                </tr>
                <tr>
                  <th context="row">Number of Reps</th>
                  <td>{numIntervals}</td>
                </tr>
              </tbody>
            </table>
            <button id="begin-practice-button" onClick={() => this.startPractice()}>click to start</button>
            <button onClick={() => this.props.returnToSetup()}>back</button>
          </div>

        }
        {started && !finished &&
          <div>

            <p id="interval-count-message">Interval {currentInterval + 1} of {numIntervals}</p>
            <p id="divider"></p>


            <button className="wide-button" onClick={() => this.playCurrentInterval()}>hear again</button>
            {/* Message container displays various messages to the user depending on content*/}
            <div className='message-container'>
              {currentAnswerCorrect && <p className='message correct'>Correct!</p>}
              {currentAnswerCorrect === false && <p className='message incorrect'>Incorrect</p>}
              
            </div>


            {/* The response buttons submit the user's answer and change style to indicate 
              whether the submitted answer was correct or incorrect */}
            <ResponseButton onClick={() => this.submitAnswer(-1)}
              text={'Flat'}
              currentCorrectAnswer={currentCorrectAnswer}
              currentAnswerCorrect={currentAnswerCorrect}
              currentSubmittedAnswer={currentSubmittedAnswer}
              buttonAnswer={-1}
            />
            <ResponseButton onClick={() => this.submitAnswer(0)}
              text={'Perfect'}
              currentCorrectAnswer={currentCorrectAnswer}
              currentAnswerCorrect={currentAnswerCorrect}
              currentSubmittedAnswer={currentSubmittedAnswer}
              buttonAnswer={0}
            />
            <ResponseButton onClick={() => this.submitAnswer(1)}
              text={'Sharp'}
              currentCorrectAnswer={currentCorrectAnswer}
              currentAnswerCorrect={currentAnswerCorrect}
              currentSubmittedAnswer={currentSubmittedAnswer}
              buttonAnswer={1}
            />
          </div>
        }
        {started && currentAnswerCorrect != null && !lastInterval &&
          <button className='wide-button' onClick={() => this.nextInterval()}>next</button>
        }
        {started && currentAnswerCorrect != null && lastInterval &&
          <button className='wide-button' onClick={() => this.handleFinish()}>finish</button>
        }
        {finished &&
          <button id='begin-practice-button' onClick={() => this.handleRestart()}>Restart</button>
        }


      </div>

    )
  }

  componentDidMount() {
    this.setState({
      detuneMagnitude: this.mapDifficultyToCents(this.props.options.difficulty),
      interval: intervals[this.props.options.interval],
      fixedStartNote: this.props.options.fixedStartNote,
      baseNote: notes[this.props.options.startNote],
    })
  }

}
