import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom'; // this works differently from V5, need to look up a tutorial
import { Provider } from 'react-redux';
import supersonicReducers from './reducers/reducers';
import { devToolsEnhancer } from 'redux-devtools-extension';

// Import scss
import './index.scss';
////////////////////////////

// import components
import App from './components/App';

const store = createStore(supersonicReducers, devToolsEnhancer());

/* This is just a little demo of audio API */
// const myButton = document.getElementById('test-button');
// myButton.innerText = 'my butt';

// const makeABeep = function () {
//     console.log('I know how to write a function.');
//     var context = new AudioContext()
//     var o = context.createOscillator()
//     o.type = "sine"
//     o.connect(context.destination)
//     o.start()
// }

// myButton.onclick = makeABeep;

class Supersonic extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {/* <MainView /> */}
          <App />
        </BrowserRouter>
      </Provider>
    );
  }
}

const container = document.getElementById('app-container');

ReactDOM.render(React.createElement(Supersonic), container);