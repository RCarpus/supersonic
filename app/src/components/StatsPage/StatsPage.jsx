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
  constructor(props) {
    super(props);
    this.state = {
      stats: undefined,
      difficulty: { name: 'MEDIUM', value: 25 },
    };
  }

  async getStats() {
    /**
     * Downloads the user's stats from the server and saves into state.
     * If the download was unsuccesful, setting stats to false should trigger 
     * an alert to the user.
     */
    let user = JSON.parse(localStorage.getItem('userData')).Username;
    let token = JSON.parse(localStorage.getItem('token'));
    let authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const stats = await Axios.get(`https://supersonic-api.herokuapp.com/users/${user}`, authHeader)
      .then(response => {
        console.log(response.data);
        console.log('successfully loaded user stats from the server');
        return response.data.Stats;
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });

    this.setState({ stats });
  }

  clickDifficulty(value) {
    // updates the difficulty setting in state
    // updates the UI accordingly
    this.setState({ difficulty: value });
    document.querySelectorAll('.stats__parameters__difficulty__button')
      .forEach(elem => { elem.classList.remove('active') });
    document.getElementById(`${value.name}`).classList.add('active');
  }


  componentDidMount() {
    console.log('attempting to load in user data');
    this.getStats();
    document.getElementById(`${this.state.difficulty.name}`).classList.add('active');
  }

  combineSessions(data, difficulty = undefined, interval = undefined, direction = undefined) {
    /**
     * Combine collected user data into one object so that can be worked on together
     * Data is an array of objects, each with one property, "session", 
     * which is an object containing the data
     */
    let combinedSubmissions = [];
    let combinedCorrect = [];
    data.forEach(session => {
      if ((session.session.difficulty === difficulty || difficulty === undefined) &&
        (session.session.interval === interval || interval === undefined) &&
        (session.session.direction == direction || direction === undefined)) {
        combinedSubmissions = combinedSubmissions.concat(session.session.submittedAnswers);
        combinedCorrect = combinedCorrect.concat(session.session.correctAnswers);
      }
    });
    return { correct: combinedCorrect, submitted: combinedSubmissions };
  }

  gradeSession(submitted, correct, subset) {
    /**
     * Calculate the percent correct where the correct answer is the subset criteria
     * eg: If we want to know how many 'sharp' answer we got correct,
     * submitted = [0, -1, 0, 1, 1];
     * correct = [0, 0, 1, 1, -1];
     * subset = 1;
     * We would want to return 0.5
     * 
     * Also includes other stats presented in the table.
     * Everything that needs to be displayed should be in the return object.
     */
    let trimmedSubmitted = [];
    for (let i = 0; i < correct.length; i++) {
      if (correct[i] === subset) {
        trimmedSubmitted.push(submitted[i]);
      }
    }
    let correctTrimmedSubmitted = trimmedSubmitted.filter(answer => { return answer === subset });
    let numCorrect = correctTrimmedSubmitted.length;
    let percentCorrect = this.asPercent(numCorrect / trimmedSubmitted.length) || 'N/A';
    let numTested = trimmedSubmitted.length;
    let falseNegatives = numTested - numCorrect;

    let falsePositives = submitted.filter((answer, index) => {
      return answer === subset && correct[index] !== subset
    }).length;

    return { percentCorrect, numTested, numCorrect, falseNegatives, falsePositives };
  }

  calculateOverallGrade(submitted, correct) {
    /**
     * Takes in two arrays and returns the percentage
     * of submitted that matches correct and the total number correct.
     * This can be used to check for directional grade without caring about
     * whether it is in tune
     */
    if (submitted.length === 0) return { grade: 'N/A', total: 'N/A' };
    let correctSubmissions = correct.map((answer, index) => {
      return answer === submitted[index] ? 1 : 0;
    });
    let total = correctSubmissions.reduce((x, y) => { return x + y });
    let grade = this.asPercent(total / correct.length);
    return { grade, total };
  }

  asPercent(value) {
    /**
     * converts a decimal number to a percent
     */
    return Math.round(value * 100) || 'N/A';
  }

  generateStatsTable(data) {
    /**
     * This method should calculate an appropriate value for each field in the stats table
     * and return an object with all the relevant stats calculated.
     */

    const intervals = [
      'UNISON', 'MINOR-2ND', 'MAJOR-2ND', 'MINOR-3RD', 'MAJOR-3RD', 'PERFECT-4TH',
      'TRITONE', 'PERFECT-5TH', 'MINOR-6TH', 'MAJOR-6TH', 'MINOR-7TH', 'MAJOR-7TH', 'OCTAVE'
    ];

    const difficulty = ['EASY', 'MEDIUM', 'HARD'];

    let table = {};
    // iterate over difficulties
    difficulty.forEach(difficulty => {
      // iterate over intervals
      intervals.forEach(interval => {
        // direction-agnostic stats
        let combinedSession = this.combineSessions(data, difficulty, interval);
        table[`${difficulty}-${interval}-OVERALL`] = this.calculateOverallGrade(combinedSession.submitted, combinedSession.correct);
        table[`${difficulty}-${interval}-FLAT`] = this.gradeSession(combinedSession.submitted, combinedSession.correct, -1);
        table[`${difficulty}-${interval}-PERFECT`] = this.gradeSession(combinedSession.submitted, combinedSession.correct, -0);
        table[`${difficulty}-${interval}-SHARP`] = this.gradeSession(combinedSession.submitted, combinedSession.correct, 1);

        // tuning-agnostic stats
        combinedSession = this.combineSessions(data, difficulty, interval, 'ASCENDING');
        table[`${difficulty}-${interval}-ASCENDING`] = this.calculateOverallGrade(combinedSession.submitted, combinedSession.correct);
        combinedSession = this.combineSessions(data, difficulty, interval, 'DESCENDING');
        table[`${difficulty}-${interval}-DESCENDING`] = this.calculateOverallGrade(combinedSession.submitted, combinedSession.correct);
        combinedSession = this.combineSessions(data, difficulty, interval, 'BOTH');
        table[`${difficulty}-${interval}-BOTH`] = this.calculateOverallGrade(combinedSession.submitted, combinedSession.correct);
      })
    })
    console.log(table);
    return table;
  }

  render() {
    const { stats, difficulty } = this.state;
    console.log(stats);
    let table;
    if (stats) {
      table = this.generateStatsTable(stats);
      console.log(Object.keys(table));
    }

    return (
      <div className='stats'>
        <h1>Stats</h1>
        <div className='stats__messages'>
          {!stats && <p className='stats__messages__loading'>Loading stats from the server</p>}
          {stats === false && <p className='stats__messages__error'>Unable to load stats from the server. Check your internet connection or try again later.</p>}
        </div>

        <div className='stats__parameters'>
          <div className='stats__parameters__difficulty'>
            <p>Difficulty</p>
            <button className='stats__parameters__difficulty__button' onClick={() => this.clickDifficulty({ name: 'EASY', value: 50 })} id='EASY'>Easy</button>
            <button className='stats__parameters__difficulty__button' onClick={() => this.clickDifficulty({ name: 'MEDIUM', value: 25 })} id='MEDIUM'>Medium</button>
            <button className='stats__parameters__difficulty__button' onClick={() => this.clickDifficulty({ name: 'HARD', value: 10 })} id='HARD'>Hard</button>
          </div>

          {/* TODO -- CREATE THIS TABLE PROGRAMMATICALLY. tHIS IS STUPID. */}

          {stats && difficulty.name === 'MEDIUM' &&
            <table className='stats__table__medium'>
              <thead>
                <tr>
                  <td></td>
                  <th>Overall</th>
                  <th>Flat</th>
                  <th>Perfect</th>
                  <th>Sharp</th>
                  <th>Ascending</th>
                  <th>Descending</th>
                  <th>Combined</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th context='row'>Unison</th>
                  <td>{table['MEDIUM-UNISON-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-UNISON-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-UNISON-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-UNISON-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-UNISON-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-UNISON-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-UNISON-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 2nd</th>
                  <td>{table['MEDIUM-MINOR-2ND-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-MINOR-2ND-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-2ND-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-2ND-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-2ND-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-MINOR-2ND-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-MINOR-2ND-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 2nd</th>
                  <td>{table['MEDIUM-MAJOR-2ND-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-2ND-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-2ND-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-2ND-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-2ND-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-2ND-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-2ND-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 3rd</th>
                  <td>{table['MEDIUM-MINOR-3RD-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-MINOR-3RD-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-3RD-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-3RD-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-3RD-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-MINOR-3RD-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-MINOR-3RD-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 3rd</th>
                  <td>{table['MEDIUM-MAJOR-3RD-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-3RD-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-3RD-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-3RD-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-3RD-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-3RD-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-3RD-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Perfect 4th</th>
                  <td>{table['MEDIUM-PERFECT-4TH-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-PERFECT-4TH-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-PERFECT-4TH-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-PERFECT-4TH-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-PERFECT-4TH-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-PERFECT-4TH-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-PERFECT-4TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Tritone</th>
                  <td>{table['MEDIUM-TRITONE-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-TRITONE-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-TRITONE-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-TRITONE-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-TRITONE-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-TRITONE-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-TRITONE-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Perfect 5th</th>
                  <td>{table['MEDIUM-PERFECT-5TH-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-PERFECT-5TH-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-PERFECT-5TH-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-PERFECT-5TH-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-PERFECT-5TH-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-PERFECT-5TH-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-PERFECT-5TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 6th</th>
                  <td>{table['MEDIUM-MINOR-6TH-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-MINOR-6TH-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-6TH-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-6TH-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-6TH-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-MINOR-6TH-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-MINOR-6TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 6th</th>
                  <td>{table['MEDIUM-MAJOR-6TH-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-6TH-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-6TH-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-6TH-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-6TH-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-6TH-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-6TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 7th</th>
                  <td>{table['MEDIUM-MINOR-7TH-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-MINOR-7TH-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-7TH-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-7TH-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-MINOR-7TH-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-MINOR-7TH-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-MINOR-7TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 7th</th>
                  <td>{table['MEDIUM-MAJOR-7TH-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-7TH-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-7TH-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-7TH-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-MAJOR-7TH-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-7TH-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-MAJOR-7TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Octave</th>
                  <td>{table['MEDIUM-OCTAVE-OVERALL'].grade}</td>
                  <td>{table['MEDIUM-OCTAVE-FLAT'].percentCorrect}</td>
                  <td>{table['MEDIUM-OCTAVE-PERFECT'].percentCorrect}</td>
                  <td>{table['MEDIUM-OCTAVE-SHARP'].percentCorrect}</td>
                  <td>{table['MEDIUM-OCTAVE-ASCENDING'].grade}</td>
                  <td>{table['MEDIUM-OCTAVE-DESCENDING'].grade}</td>
                  <td>{table['MEDIUM-OCTAVE-BOTH'].grade}</td>
                </tr>
              </tbody>
            </table>

          }

          {stats && difficulty.name === 'EASY' &&
            <table className='stats__table__EASY'>
              <thead>
                <tr>
                  <td></td>
                  <th>Overall</th>
                  <th>Flat</th>
                  <th>Perfect</th>
                  <th>Sharp</th>
                  <th>Ascending</th>
                  <th>Descending</th>
                  <th>Combined</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th context='row'>Unison</th>
                  <td>{table['EASY-UNISON-OVERALL'].grade}</td>
                  <td>{table['EASY-UNISON-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-UNISON-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-UNISON-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-UNISON-ASCENDING'].grade}</td>
                  <td>{table['EASY-UNISON-DESCENDING'].grade}</td>
                  <td>{table['EASY-UNISON-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 2nd</th>
                  <td>{table['EASY-MINOR-2ND-OVERALL'].grade}</td>
                  <td>{table['EASY-MINOR-2ND-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-2ND-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-2ND-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-2ND-ASCENDING'].grade}</td>
                  <td>{table['EASY-MINOR-2ND-DESCENDING'].grade}</td>
                  <td>{table['EASY-MINOR-2ND-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 2nd</th>
                  <td>{table['EASY-MAJOR-2ND-OVERALL'].grade}</td>
                  <td>{table['EASY-MAJOR-2ND-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-2ND-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-2ND-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-2ND-ASCENDING'].grade}</td>
                  <td>{table['EASY-MAJOR-2ND-DESCENDING'].grade}</td>
                  <td>{table['EASY-MAJOR-2ND-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 3rd</th>
                  <td>{table['EASY-MINOR-3RD-OVERALL'].grade}</td>
                  <td>{table['EASY-MINOR-3RD-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-3RD-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-3RD-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-3RD-ASCENDING'].grade}</td>
                  <td>{table['EASY-MINOR-3RD-DESCENDING'].grade}</td>
                  <td>{table['EASY-MINOR-3RD-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 3rd</th>
                  <td>{table['EASY-MAJOR-3RD-OVERALL'].grade}</td>
                  <td>{table['EASY-MAJOR-3RD-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-3RD-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-3RD-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-3RD-ASCENDING'].grade}</td>
                  <td>{table['EASY-MAJOR-3RD-DESCENDING'].grade}</td>
                  <td>{table['EASY-MAJOR-3RD-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Perfect 4th</th>
                  <td>{table['EASY-PERFECT-4TH-OVERALL'].grade}</td>
                  <td>{table['EASY-PERFECT-4TH-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-PERFECT-4TH-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-PERFECT-4TH-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-PERFECT-4TH-ASCENDING'].grade}</td>
                  <td>{table['EASY-PERFECT-4TH-DESCENDING'].grade}</td>
                  <td>{table['EASY-PERFECT-4TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Tritone</th>
                  <td>{table['EASY-TRITONE-OVERALL'].grade}</td>
                  <td>{table['EASY-TRITONE-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-TRITONE-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-TRITONE-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-TRITONE-ASCENDING'].grade}</td>
                  <td>{table['EASY-TRITONE-DESCENDING'].grade}</td>
                  <td>{table['EASY-TRITONE-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Perfect 5th</th>
                  <td>{table['EASY-PERFECT-5TH-OVERALL'].grade}</td>
                  <td>{table['EASY-PERFECT-5TH-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-PERFECT-5TH-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-PERFECT-5TH-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-PERFECT-5TH-ASCENDING'].grade}</td>
                  <td>{table['EASY-PERFECT-5TH-DESCENDING'].grade}</td>
                  <td>{table['EASY-PERFECT-5TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 6th</th>
                  <td>{table['EASY-MINOR-6TH-OVERALL'].grade}</td>
                  <td>{table['EASY-MINOR-6TH-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-6TH-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-6TH-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-6TH-ASCENDING'].grade}</td>
                  <td>{table['EASY-MINOR-6TH-DESCENDING'].grade}</td>
                  <td>{table['EASY-MINOR-6TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 6th</th>
                  <td>{table['EASY-MAJOR-6TH-OVERALL'].grade}</td>
                  <td>{table['EASY-MAJOR-6TH-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-6TH-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-6TH-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-6TH-ASCENDING'].grade}</td>
                  <td>{table['EASY-MAJOR-6TH-DESCENDING'].grade}</td>
                  <td>{table['EASY-MAJOR-6TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 7th</th>
                  <td>{table['EASY-MINOR-7TH-OVERALL'].grade}</td>
                  <td>{table['EASY-MINOR-7TH-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-7TH-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-7TH-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-MINOR-7TH-ASCENDING'].grade}</td>
                  <td>{table['EASY-MINOR-7TH-DESCENDING'].grade}</td>
                  <td>{table['EASY-MINOR-7TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 7th</th>
                  <td>{table['EASY-MAJOR-7TH-OVERALL'].grade}</td>
                  <td>{table['EASY-MAJOR-7TH-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-7TH-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-7TH-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-MAJOR-7TH-ASCENDING'].grade}</td>
                  <td>{table['EASY-MAJOR-7TH-DESCENDING'].grade}</td>
                  <td>{table['EASY-MAJOR-7TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Octave</th>
                  <td>{table['EASY-OCTAVE-OVERALL'].grade}</td>
                  <td>{table['EASY-OCTAVE-FLAT'].percentCorrect}</td>
                  <td>{table['EASY-OCTAVE-PERFECT'].percentCorrect}</td>
                  <td>{table['EASY-OCTAVE-SHARP'].percentCorrect}</td>
                  <td>{table['EASY-OCTAVE-ASCENDING'].grade}</td>
                  <td>{table['EASY-OCTAVE-DESCENDING'].grade}</td>
                  <td>{table['EASY-OCTAVE-BOTH'].grade}</td>
                </tr>
              </tbody>
            </table>

          }


          {stats && difficulty.name === 'HARD' &&
            <table className='stats__table__HARD'>
              <thead>
                <tr>
                  <td></td>
                  <th>Overall</th>
                  <th>Flat</th>
                  <th>Perfect</th>
                  <th>Sharp</th>
                  <th>Ascending</th>
                  <th>Descending</th>
                  <th>Combined</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th context='row'>Unison</th>
                  <td>{table['HARD-UNISON-OVERALL'].grade}</td>
                  <td>{table['HARD-UNISON-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-UNISON-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-UNISON-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-UNISON-ASCENDING'].grade}</td>
                  <td>{table['HARD-UNISON-DESCENDING'].grade}</td>
                  <td>{table['HARD-UNISON-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 2nd</th>
                  <td>{table['HARD-MINOR-2ND-OVERALL'].grade}</td>
                  <td>{table['HARD-MINOR-2ND-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-2ND-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-2ND-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-2ND-ASCENDING'].grade}</td>
                  <td>{table['HARD-MINOR-2ND-DESCENDING'].grade}</td>
                  <td>{table['HARD-MINOR-2ND-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 2nd</th>
                  <td>{table['HARD-MAJOR-2ND-OVERALL'].grade}</td>
                  <td>{table['HARD-MAJOR-2ND-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-2ND-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-2ND-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-2ND-ASCENDING'].grade}</td>
                  <td>{table['HARD-MAJOR-2ND-DESCENDING'].grade}</td>
                  <td>{table['HARD-MAJOR-2ND-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 3rd</th>
                  <td>{table['HARD-MINOR-3RD-OVERALL'].grade}</td>
                  <td>{table['HARD-MINOR-3RD-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-3RD-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-3RD-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-3RD-ASCENDING'].grade}</td>
                  <td>{table['HARD-MINOR-3RD-DESCENDING'].grade}</td>
                  <td>{table['HARD-MINOR-3RD-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 3rd</th>
                  <td>{table['HARD-MAJOR-3RD-OVERALL'].grade}</td>
                  <td>{table['HARD-MAJOR-3RD-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-3RD-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-3RD-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-3RD-ASCENDING'].grade}</td>
                  <td>{table['HARD-MAJOR-3RD-DESCENDING'].grade}</td>
                  <td>{table['HARD-MAJOR-3RD-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Perfect 4th</th>
                  <td>{table['HARD-PERFECT-4TH-OVERALL'].grade}</td>
                  <td>{table['HARD-PERFECT-4TH-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-PERFECT-4TH-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-PERFECT-4TH-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-PERFECT-4TH-ASCENDING'].grade}</td>
                  <td>{table['HARD-PERFECT-4TH-DESCENDING'].grade}</td>
                  <td>{table['HARD-PERFECT-4TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Tritone</th>
                  <td>{table['HARD-TRITONE-OVERALL'].grade}</td>
                  <td>{table['HARD-TRITONE-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-TRITONE-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-TRITONE-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-TRITONE-ASCENDING'].grade}</td>
                  <td>{table['HARD-TRITONE-DESCENDING'].grade}</td>
                  <td>{table['HARD-TRITONE-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Perfect 5th</th>
                  <td>{table['HARD-PERFECT-5TH-OVERALL'].grade}</td>
                  <td>{table['HARD-PERFECT-5TH-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-PERFECT-5TH-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-PERFECT-5TH-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-PERFECT-5TH-ASCENDING'].grade}</td>
                  <td>{table['HARD-PERFECT-5TH-DESCENDING'].grade}</td>
                  <td>{table['HARD-PERFECT-5TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 6th</th>
                  <td>{table['HARD-MINOR-6TH-OVERALL'].grade}</td>
                  <td>{table['HARD-MINOR-6TH-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-6TH-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-6TH-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-6TH-ASCENDING'].grade}</td>
                  <td>{table['HARD-MINOR-6TH-DESCENDING'].grade}</td>
                  <td>{table['HARD-MINOR-6TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 6th</th>
                  <td>{table['HARD-MAJOR-6TH-OVERALL'].grade}</td>
                  <td>{table['HARD-MAJOR-6TH-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-6TH-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-6TH-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-6TH-ASCENDING'].grade}</td>
                  <td>{table['HARD-MAJOR-6TH-DESCENDING'].grade}</td>
                  <td>{table['HARD-MAJOR-6TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Minor 7th</th>
                  <td>{table['HARD-MINOR-7TH-OVERALL'].grade}</td>
                  <td>{table['HARD-MINOR-7TH-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-7TH-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-7TH-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-MINOR-7TH-ASCENDING'].grade}</td>
                  <td>{table['HARD-MINOR-7TH-DESCENDING'].grade}</td>
                  <td>{table['HARD-MINOR-7TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Major 7th</th>
                  <td>{table['HARD-MAJOR-7TH-OVERALL'].grade}</td>
                  <td>{table['HARD-MAJOR-7TH-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-7TH-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-7TH-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-MAJOR-7TH-ASCENDING'].grade}</td>
                  <td>{table['HARD-MAJOR-7TH-DESCENDING'].grade}</td>
                  <td>{table['HARD-MAJOR-7TH-BOTH'].grade}</td>
                </tr>
                <tr>
                  <th context='row'>Octave</th>
                  <td>{table['HARD-OCTAVE-OVERALL'].grade}</td>
                  <td>{table['HARD-OCTAVE-FLAT'].percentCorrect}</td>
                  <td>{table['HARD-OCTAVE-PERFECT'].percentCorrect}</td>
                  <td>{table['HARD-OCTAVE-SHARP'].percentCorrect}</td>
                  <td>{table['HARD-OCTAVE-ASCENDING'].grade}</td>
                  <td>{table['HARD-OCTAVE-DESCENDING'].grade}</td>
                  <td>{table['HARD-OCTAVE-BOTH'].grade}</td>
                </tr>
              </tbody>
            </table>

          }


        </div>



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
