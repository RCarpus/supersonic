import React from 'react';
import ReactDOM from 'react-dom';
import { devToolsEnhancer } from 'redux-devtools-extension';

// Import scss
import './index.scss';
////////////////////////////

// import components
import App from './components/App/App';

class Supersonic extends React.Component {
  render() {
    return (
      <App />
    );
  }
}

const container = document.getElementById('app-container');

ReactDOM.render(React.createElement(Supersonic), container);