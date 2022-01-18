// import libraries
import React from 'react';

// import necessary components
// import SomeComponent from '../components/SomeComponent';
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
            <p id='landing-page__welcome-img__title'>Supersonic Ear Training</p>
          </div>
          

        </div>
        <h2>Fined-tuned ear training</h2>
        <p>Some cool info about this app</p>
        {showLoginView && <LoginView handleLogin={this.props.handleLogin}
          showRegisterView={() => this.showRegisterView()} />}
        {showRegisterView && <RegisterView showLoginView={() => this.showLoginView()} />}
      </div >
    )
  }
}

