import React from 'react';
import './HoverInfo.scss';

export default class extends React.Component {
  render() {
    const { title, text } = this.props;
    return (
      <div className="hover-info" title="some text">
        <span className="hover-info__title">{title}</span>
        <p className="hover-info__text">{text}</p>
      </div>
    )
  }
}