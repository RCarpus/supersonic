// import libraries
import React from 'react';
import { notes, playNote, playNoteSequence, IntervalGroup } from '../../audio-functions';
// import { connect } from 'react-redux';

// import actions

// import necessary components
// import SomeComponent from '../components/SomeComponent';
import ResponseButton from '../response-button/ResponseButton';
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
      practiceStyle: { name: 'MELODIC', value: false},
    };

    // Try to pull settings from localStorage, uses defaults if not found
    let settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings;

    this.state = {
      started: false,
      currentInterval: 0,
      currentCorrectAnswer: undefined, // This is -1, 0, or 1, not to be confused with currentAnswerCorrect
      currentSubmittedAnswer: undefined,
      numIntervals: 5,
      submittedAnswers: [],
      intervalGroup: undefined,
      currentAnswerCorrect: undefined, // This is boolean, not to be confused with currentCorrectAnswer
      settings: settings,
    };
  }

  startPractice() {
    /**
     * Starts the practice session.
     * Start by setting started to true.
     * Creates a new intervalGroup and generates the intervals.
     */
    // pull settings from state to put into IntervalGroup object
    this.setState({
      started: true,
      intervalGroup: new IntervalGroup(5),
    }, () => {
      this.state.intervalGroup.generateIntervals();
      this.playCurrentInterval();
    });
  }

  playCurrentInterval() {
    /**
     * Plays the current interval.
     * This should take user settings into account,
     * but as this is just a mockup,
     * settings are hardcoded.
     */
    let index = this.state.currentInterval;
    let detuneMagnitude = 50;
    let detune;
    const noteDuration = this.state.settings.noteDuration.value;
    const soundWaveType = this.state.settings.soundWaveType;
    const practiceStyle = this.state.settings.practiceStyle.value;

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
    playNoteSequence(soundWaveType, noteDuration, 440, 493.88, detune, practiceStyle);
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
    this.setState({
      currentInterval: updatedIndex,
      currentAnswerCorrect: null,
      currentSubmittedAnswer: null,
    }, () => {
      this.playCurrentInterval();
    });
  }

  handleFinish() {
    console.log('finished');
  }

  render() {
    const { started, currentAnswerCorrect, currentInterval, numIntervals,
      currentCorrectAnswer, currentSubmittedAnswer } = this.state;
    const lastInterval = currentInterval === numIntervals - 1;
    const finished = currentInterval === numIntervals;

    return (
      <div>
        <h2>This is a training session.</h2>
        {!started && <button onClick={() => this.startPractice()}>click to start</button>}
        {started && !finished &&
          <div>
            <h3>The session has begun</h3>

            {/* This will display a message telling the user if they have gotten the correct
              or incorrect answer. This is necessarily in case people have CSS disabled or are colorblind. */}
            <div className='message-container'>
              {currentAnswerCorrect && <p className='message correct'>Correct!</p>}
              {currentAnswerCorrect === false && <p className='message incorrect'>Incorrect</p>}
            </div>

            <button onClick={() => this.playCurrentInterval()}>hear again</button>

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
          <button onClick={() => this.nextInterval()}>next</button>
        }
        {started && currentAnswerCorrect != null && lastInterval &&
          <button onClick={() => this.handleFinish()}>finish</button>

        }


      </div>

    )
  }

  componentDidUpdate() {
    console.log('logging updated state');
    console.log(this.state);
  }
}

// Add anything needed in this component from the global state
// let mapStateToProps = state => {
//   return {
//     userData: state.userData,
//   }
// }

// The second parameter object contains the state actions we imported at the top
// export default connect(mapStateToProps, null)(PracticeSetupPage);
