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
            <p className='landing-page__welcome-img__text' id='landing-page__welcome-img__title'>
              Supersonic
            </p>
            <p className='landing-page__welcome-img__text welcome-img__text__smaller'>
              fine-tuned ear training
            </p>
          </div>


        </div>
        <h1>Welcome to Supersonic!</h1>
        <p>This is where I would put some cool introductory text about this app if I had written it yet! Some cool info about this cool app. Yup. I love cats. They're just great.</p>
        {showLoginView && <LoginView handleLogin={this.props.handleLogin}
          showRegisterView={() => this.showRegisterView()} />}
        {showRegisterView && <RegisterView showLoginView={() => this.showLoginView()} />}
      </div >
    )
  }
}

