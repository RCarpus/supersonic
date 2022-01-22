// import libraries
import React from 'react';
import Axios from 'axios';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import HoverInfo from '../HoverInfo/HoverInfo';

export default class StatsSetupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: undefined,
      difficulty: { name: 'MEDIUM', value: 25 },
      loading: true,
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
        return response.data.Stats;
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });

    this.setState({ stats, loading: false });

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
        combinedSession = this.combineSessions(data, difficulty, interval, 'SIMULTANEOUS');
        table[`${difficulty}-${interval}-SIMULTANEOUS`] = this.calculateOverallGrade(combinedSession.submitted, combinedSession.correct);
      })
    })
    return table;
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
    const { stats, difficulty, loading } = this.state;
    let table;
    let tables = [];
    const intervals = [
      'UNISON', 'MINOR-2ND', 'MAJOR-2ND', 'MINOR-3RD', 'MAJOR-3RD', 'PERFECT-4TH',
      'TRITONE', 'PERFECT-5TH', 'MINOR-6TH', 'MAJOR-6TH', 'MINOR-7TH', 'MAJOR-7TH', 'OCTAVE'
    ];

    // Wait until the stats are loaded in to build the table
    if (stats) {
      table = this.generateStatsTable(stats);
      let difficulties = ['EASY', 'MEDIUM', 'HARD'];

      // Generate the stats table html from the calculated stats
      for (let i = 0; i < difficulties.length; i++) { // iterate over the difficulties
        // Create each table row which will be inserted into the new table when it is built
        let tableRows = [];
        intervals.forEach(interval => {
          tableRows.push(
            <tr>
              <th context='row'>{this.formatOptionsText(interval)}</th>
              <td>{table[`${difficulties[i]}-${interval}-OVERALL`].grade}</td>
              <td>{table[`${difficulties[i]}-${interval}-FLAT`].percentCorrect}</td>
              <td>{table[`${difficulties[i]}-${interval}-PERFECT`].percentCorrect}</td>
              <td>{table[`${difficulties[i]}-${interval}-SHARP`].percentCorrect}</td>
              <td>{table[`${difficulties[i]}-${interval}-ASCENDING`].grade}</td>
              <td>{table[`${difficulties[i]}-${interval}-DESCENDING`].grade}</td>
              <td>{table[`${difficulties[i]}-${interval}-BOTH`].grade}</td>
              <td>{table[`${difficulties[i]}-${interval}-SIMULTANEOUS`].grade}</td>
            </tr>
          );
        })

        // Set up a new table with headers
        let builtUpTable = (
          <table className={`stats__table__${difficulties[i]} table`}>
            <thead>
              <tr>
                <td></td>
                <th><HoverInfo title="Overall" text="total percent correct for Unison at this difficulty" /></th>
                <th><HoverInfo title="Flat" text="total percent correct for Unison at this difficulty" /></th>
                <th><HoverInfo title="Perfect" text="total percent correct for Unison at this difficulty" /></th>
                <th><HoverInfo title="Sharp" text="total percent correct for Unison at this difficulty" /></th>
                <th><HoverInfo title="Ascending" text="total percent correct for Unison at this difficulty" /></th>
                <th><HoverInfo title="Descending" text="total percent correct for Unison at this difficulty" /></th>
                <th><HoverInfo title="Combined" text="total percent correct for Unison at this difficulty" /></th>
                <th><HoverInfo title="Simultaneous" text="total percent correct for Unison at this difficulty" /></th>
              </tr>
            </thead>
            {/* Insert the table row that we generated before */}
            <tbody>{tableRows}</tbody>
          </table>
        );
        tables.push(builtUpTable);
      }
    }

    return (
      <div className='stats'>
        {loading && <LoadingIndicator />}
        <h1>Stats</h1>
        <div className='stats__messages'>
          {!stats && <p className='stats__messages__loading'>Loading stats from the server</p>}
          {stats === false && <p className='stats__messages__error'>Unable to load stats from the server. Check your internet connection or try again later.</p>}
        </div>

        <div className='stats__parameters'>
          <div className='stats__parameters__difficulty'>
            <button className='stats__parameters__difficulty__button' onClick={() => this.clickDifficulty({ name: 'EASY', value: 50 })} id='EASY'>Easy</button>
            <button className='stats__parameters__difficulty__button' onClick={() => this.clickDifficulty({ name: 'MEDIUM', value: 25 })} id='MEDIUM'>Medium</button>
            <button className='stats__parameters__difficulty__button' onClick={() => this.clickDifficulty({ name: 'HARD', value: 10 })} id='HARD'>Hard</button>
          </div>

          {stats && difficulty.name === 'EASY' && tables[0]}
          {stats && difficulty.name === 'MEDIUM' && tables[1]}
          {stats && difficulty.name === 'HARD' && tables[2]}
        </div>
      </div>
    )
  }
}

