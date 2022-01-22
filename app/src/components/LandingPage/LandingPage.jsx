import React from 'react';

// import necessary components
import LoginView from '../LoginView/LoginView';
import RegisterView from '../RegisterView/RegisterView';

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * By default, the login view should render, but not the register view.
       * The user should be able to click back and forth between the two views 
       * while not logged in.
       */
      showLoginView: true,
      showRegisterView: false,
    }
  }

  showLoginView() {
    // Toggle on LoginView, toggle off RegisterView
    this.setState({
      showLoginView: true,
      showRegisterView: false,
    })
  }

  showRegisterView() {
    // Toggle on RegisterView, toggle off LoginView
    this.setState({
      showLoginView: false,
      showRegisterView: true,
    })
  }

  render() {
    const { showLoginView, showRegisterView } = this.state;
    return (
      <div id="landing-page">
        <div id='landing-page__welcome-img-container'>
          <div id='landing-page__welcome-img-background-color'>
            <p className='landing-page__welcome-img__text' id='landing-page__welcome-img__title'>
              Supersonic
            </p>
            <p className='landing-page__welcome-img__text welcome-img__text__smaller'>
              fine-tuned ear training
            </p>
          </div>

        </div>
        <h1>Welcome to Supersonic!</h1>
        <p>Supersonic is a web application designed to help skilled musicians improve their ability to identify out-of-tune notes. </p>
        <p>
          There are already several ear training apps available for free on the web, and many of them are very useful tools, but they only address part of the picture. Most apps teach musicians to identify the interval between notes that are in-tune. This is a critical skill for musicians, but any musician who plays a "fretless" instrument or an instrument where the player has more control over the pitch than a piano would (including the voice) must also be able to discern whether a given note is in-tune or not. This is because, while most western music pretends there are 12 notes divided evenly between each octave, the reality is there are an infinite amount of notes hiding between the notes we use in our music. A musician with undeveloped ears may be able to play notes that are generally correct, close enough the target frequencies of the notes they think they are playing that they sound good when playing alone, but in a group settings, these mistakes tend to become more obvious and detrimental to the group.
        </p>
        <p>
          Ready to get started? Creating an account is easy and free. I hope you have fun and get some value out of Supersonic!
        </p>
        {showLoginView && <LoginView handleLogin={this.props.handleLogin}
          showRegisterView={() => this.showRegisterView()} />}
        {showRegisterView && <RegisterView showLoginView={() => this.showLoginView()} />}
      </div >
    )
  }
}

