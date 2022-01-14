// import libraries
import React from 'react';

import './SessionResults.scss';


const mockStats = {
  correctAnswers: [0, 1, 1, 1, -1],
  detuneMagnitude: 25,
  difficulty: "MEDIUM",
  direction: "ASCENDING",
  fixedStartNote: "FIXED-FALSE",
  interval: "PERFECT-5TH",
  reps: 5,
  submittedAnswers: [0, 1, 1, 1, 1],
  startNote: 'A4',
}

export default class SessionResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMoreDetails: false,
    };
  }

  calculateOverallGrade(submitted, correct) {
    /**
     * Takes in two arrays and returns the percentage
     * of submitted that matches correct and the total number correct
     */
    let correctSubmissions = correct.map((answer, index) => {
      return answer === submitted[index] ? 1 : 0;
    });
    let total = correctSubmissions.reduce((x, y) => { return x + y });
    let grade = total / correct.length;
    return { grade, total };
  }

  gradeSubset(submitted, correct, subset) {
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
    let percentCorrect = numCorrect / trimmedSubmitted.length || 'N/A';
    let numTested = trimmedSubmitted.length;
    let falseNegatives = numTested - numCorrect;

    let falsePositives = submitted.filter((answer, index) => {
      return answer === subset && correct[index] !== subset
    }).length;

    return { percentCorrect, numTested, numCorrect, falseNegatives, falsePositives };
  }

  asPercent(value) {
    /**
     * converts a decimal number to a percent
     */
    return Math.round(value * 100) || 'N/A';
  }


  render() {
    const { stats } = this.props;
    const overallGrade = this.calculateOverallGrade(stats.submittedAnswers, stats.correctAnswers);
    const flatGrade = this.gradeSubset(stats.submittedAnswers, stats.correctAnswers, -1);
    const perfectGrade = this.gradeSubset(stats.submittedAnswers, stats.correctAnswers, 0);
    const sharpGrade = this.gradeSubset(stats.submittedAnswers, stats.correctAnswers, 1);

    return (
      <div className="session-results">
        <h2>Session Results</h2>
        <p>You scored {overallGrade.total}/{stats.correctAnswers.length}</p>
        <p>{this.asPercent(overallGrade.grade)}%</p>
        <table>
          <thead>
            <tr>
              <td></td>
              <th>Flat</th>
              <th>Perfect</th>
              <th>Sharp</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th scope="row">tested</th>
              <td>{flatGrade.numTested}</td>
              <td>{perfectGrade.numTested}</td>
              <td>{sharpGrade.numTested}</td>
            </tr>
            <tr>
              <th scope="row">correct</th>
              <td>{flatGrade.numCorrect}</td>
              <td>{perfectGrade.numCorrect}</td>
              <td>{sharpGrade.numCorrect}</td>
            </tr>
            <tr>
              <th scope="row">Percent Correct</th>
              <td>{this.asPercent(flatGrade.percentCorrect)}</td>
              <td>{this.asPercent(perfectGrade.percentCorrect)}</td>
              <td>{this.asPercent(sharpGrade.percentCorrect)}</td>
            </tr>
            <tr>
              <th scope="row">false positives</th>
              <td>{flatGrade.falsePositives}</td>
              <td>{perfectGrade.falsePositives}</td>
              <td>{sharpGrade.falsePositives}</td>
            </tr>
            <tr>
              <th scope="row">false negatives</th>
              <td>{flatGrade.falseNegatives}</td>
              <td>{perfectGrade.falseNegatives}</td>
              <td>{sharpGrade.falseNegatives}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th scope="row">Practice type</th>
              <td>{this.props.formatOptionsText(stats.interval)}</td>
            </tr>
            <tr>
              <th scope="row">Difficulty</th>
              <td>{this.props.formatOptionsText(stats.difficulty)} (+/- {stats.detuneMagnitude} cents)</td>
            </tr>
            <tr>
              <th scope="row">Direction</th>
              <td>{this.props.formatOptionsText(stats.direction)}</td>
            </tr>
            <tr>
              <th scope="row">Fixed start note</th>
              <td>{stats.fixedStartNote === "FIXED-FALSE" ? 'No' : stats.startNote}</td>
            </tr>
          </tbody>

        </table>
      </div>
    )
  }
}
