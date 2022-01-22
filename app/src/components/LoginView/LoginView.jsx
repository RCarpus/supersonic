import React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

export default class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toRegistrationView = props.toRegistrationView;
    this.handleLogin = props.handleLogin;
    this.state = {
      loading: false,
    }
  }

  handleSubmit() {
    /**
     * validates the form, and then if the form is valid,
     * sends a post to the server to log in the user.
     * The response token and userData are saved in localStorage
     * for access in other areas of the app.
     */
    if (this.form.current.reportValidity()) {
      this.setState({ loading: true }, () => {
        let loginCredentials = {
          Username: this.form.current[0].value,
          Password: this.form.current[1].value
        };
        axios.post('https://supersonic-api.herokuapp.com/login', loginCredentials)
          .then(response => {
            const data = response.data;
            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('userData', JSON.stringify(data.user));
            this.props.handleLogin(); // Tells the main App component that we have logged in.
          })
          .catch(e => {
            console.log('no such user')
            window.alert('invalid username or password');
          });
      });
    }
  };

  render() {
    const {loading} = this.state;
    return (
      <div className="login-view">
        {loading && <LoadingIndicator/>}
        <h2 className="display-4">Login</h2>
        <Form className="login-form" ref={this.form} onSubmit={e => e.preventDefault()}>
          
          <Form.Group controlId="formUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control required />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" required />
          </Form.Group>

          <Button id='login-button' variant="primary" type="submit" onClick={this.handleSubmit}>
            Log in
          </Button>

        </Form>
        <Button id='to-registration-view-button' onClick={this.props.showRegisterView}>Register</Button>
      </div>
    )
  }
}

