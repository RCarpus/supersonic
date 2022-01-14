import React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class RegistrationView extends React.Component {
  constructor() {
    super();
    this.form = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    /**
     * Validates the form,
     * then sends a post to the server to register a new user.
     * After a successful registration, the user is redirected to the login screen.
     */
    let newUserInfo = {};

    if (this.form.current.reportValidity()) {
      newUserInfo.Username = this.form.current[0].value;
      newUserInfo.Password = this.form.current[1].value;
      newUserInfo.Email = this.form.current[2].value;

      axios.post('https://supersonic-api.herokuapp.com/users/register', newUserInfo)
        .then(response => {
          console.log(response.data);
          this.props.showLoginView();
        })
        .catch(e => {
          console.log('something went wrong. Maybe some info was missing.')
        });
    }
  };

  render() {

    return (
      <div className="registration-view">
        <h2 className="display-4">Sign up for a free Supersonic account</h2>
        <p>Signing up for a free account allows you to save your practice statistics and track your improvement over time. We will never share your account information with anybody.</p>

        <Form className="registration-form" ref={this.form} onSubmit={e => e.preventDefault()}>

          <Form.Group className="registration-form__line">
            <Form.Label className="registration-form__line-label">
              Username <span className="registration-form__label-tips">(alphanumeric, no spaces)</span>
            </Form.Label>
            <Form.Control className="registration-form__line__input-field" pattern="^[a-zA-Z0-9]{1,}$" required />
          </Form.Group>

          <Form.Group className="registration-form__line">
            <Form.Label className="registration-form__line-label">
              Enter desired password <span className="registration-form__label-tips">(8+ characters)</span>
            </Form.Label>
            <Form.Control className="registration-form__line__input-field" type="password" pattern=".{8,}" required />
          </Form.Group>

          <Form.Group className="registration-form__line">
            <Form.Label className="registration-form__line-label">
              Email <span className="registration-form__label-tips">(required)</span>
            </Form.Label>
            <Form.Control className="registration-form__line__input-field" pattern=".*@.*\..*" required />
          </Form.Group>

          <Button className="register-button" variant="primary" type="submit" onClick={this.handleSubmit}>Register</Button>
          <Button id="already-registered-button" onClick={this.props.showLoginView} className="btn btn-secondary">I already have an account</Button>
        </Form>
      </div>
    )
  }
}

