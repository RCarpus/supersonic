import React from 'react';

import './ResponseButton.scss';

export default class ResponseButton extends React.Component {

  render() {
    const {text, currentCorrectAnswer, currentAnswerCorrect, buttonAnswer, currentSubmittedAnswer} = this.props;

    /**
     * If the user clicked on the correct answer, we want to display that visually using CSS.
     * Same for if the user clicked on the wrong answer.
     */
    let grade = '';
    // User clicked correct answer, and this button was the correct button
    if (currentAnswerCorrect != null && currentCorrectAnswer === buttonAnswer) grade = '-correct';

    // User clicked incorrect answer, and this button was clicked on
    if (currentAnswerCorrect != null && 
      currentCorrectAnswer !== buttonAnswer &&
      currentSubmittedAnswer === buttonAnswer) grade = '-incorrect';

    return(
      <button className={`response-button${grade}`} onClick={this.props.onClick}>{text}</button>
    );
  }
}