import React from 'react';
import './LoadingIndicator.scss';

export default class LoadingIndicator extends React.Component {
  render() {
    return (
      <div className='loading-message'>
        <p className='loading-message__text'>Loading</p>
      </div>
    )
  }
}