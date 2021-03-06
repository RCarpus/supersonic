import React from 'react';
import './Footer.scss';

export default class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <p className="footer__text">I'm Ryan Carpus! I made this website because I love music and writing code. To see some of my other work, <a href="https://rcarpus.github.io" target="_blank">check out my portfolio</a>.</p>
      </div>
    )
  }
}