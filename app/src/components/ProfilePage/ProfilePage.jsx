// import libraries
import React from 'react';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

export default class ProfilePage extends React.Component {
  constructor() {
    super();
    this.form = React.createRef();
    this.updateUserData = this.updateUserData.bind(this);
    this.state = {
      loading: false,
    }
  }

  updateUserData() {
    if (this.form.current.reportValidity()) {

      const user = JSON.parse(localStorage.getItem('userData')).Username;
      const token = JSON.parse(localStorage.getItem('token'));

      let Username = this.form.current[0].value;
      let Password = this.form.current[1].value;
      let Email = this.form.current[2].value;
      let updatedData = {};
      if (Username.length > 0) updatedData.Username = Username;
      if (Password.length > 0) updatedData.Password = Password;
      if (Email.length > 0) updatedData.Email = Email;

      let authHeader = { headers: { Authorization: `Bearer ${token}` } }
      this.setState({ loading: true }, () => {
        Axios.put(`https://supersonic-api.herokuapp.com/users/${user}`, updatedData, authHeader)
          .then(response => {
            window.alert('successfully updated user data');
            localStorage.setItem('userData', JSON.stringify(response.data.updatedUser));
          })
          .catch(function (error) {
            console.log(error);
            window.alert('Something went wrong. Check your internet connection or try again later.');
          });
        this.setState({ loading: false });
      })

    }
    else {
      console.log('invalid form');
    }
  }

  render() {
    const { loading } = this.state;
    const userData = JSON.parse(localStorage.getItem('userData'));
    const username = userData.Username;
    const password = '******** (min 8 chars)';
    const email = userData.Email;
    return (
      <div id='profile-page'>
        {loading && <LoadingIndicator />}
        <div className="user-info">
          <h1>Profile</h1>
          <Form className="update-info-form" ref={this.form} onSubmit={e => e.preventDefault()}>

            <Form.Group>
              <Form.Label className="user-info__form-label">
                Username
              </Form.Label>
              <Form.Control className="user-info__form-input" placeholder={username}
                pattern="^[a-zA-Z0-9]{1,}$" />
            </Form.Group>

            <Form.Group>
              <Form.Label className="user-info__form-label">
                Password
              </Form.Label>
              <Form.Control className="user-info__form-input" placeholder={password}
                pattern=".{8,}" type="password"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="user-info__form-label">
                E-mail
              </Form.Label>
              <Form.Control className="user-info__form-input" placeholder={email}
                pattern=".*@.*\..*" />
            </Form.Group>


            <button className="update-button" type="submit" onClick={this.updateUserData} >Update</button>

          </Form>
        </div>
      </div>
    )
  }
}
