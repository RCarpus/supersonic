// import libraries
import React from 'react';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// import necessary components
// import SomeComponent from '../components/SomeComponent';
/* ---------------------- */

// import stylesheet

export default class ProfilePage extends React.Component {
  constructor() {
    super();
    this.form = React.createRef();
    this.updateUserData = this.updateUserData.bind(this);
    // this.unregister = this.unregister.bind(this);
  }

  updateUserData() {
    if (this.form.current.reportValidity()) {

      const user = JSON.parse(localStorage.getItem('userData')).Username;
      const token = JSON.parse(localStorage.getItem('token'));
      console.log(user);
      console.log(token);

      let Username = this.form.current[0].value;
      let Password = this.form.current[1].value;
      let Email = this.form.current[2].value;
      console.log(Username, Password, Email);
      let updatedData = {};
      if (Username.length > 0) updatedData.Username = Username;
      if (Password.length > 0) updatedData.Password = Password;
      if (Email.length > 0) updatedData.Email = Email;
      console.log(updatedData);

      let authHeader = { headers: { Authorization: `Bearer ${token}` } }
      console.log(authHeader);
      Axios.put(`https://supersonic-api.herokuapp.com/users/${user}`, updatedData, authHeader)
        .then(response => {
          window.alert('successfully updated user data');
          console.log(response.data);
          localStorage.setItem('userData', JSON.stringify(response.data.updatedUser));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else {
      console.log('invalid form');
    }
  }

  render() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const username = userData.Username;
    const password = '*****';
    const email = userData.Email;
    return (
      <div>
        <div className="user-info">
          <h2>Profile</h2>
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
                pattern=".{8,}"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="user-info__form-label">
                E-mail
              </Form.Label>
              <Form.Control className="user-info__form-input" placeholder={email}
                pattern=".*@.*\..*" />
            </Form.Group>


            <Button className="btn btn-secondary btn-sm" variant="primary" type="submit" onClick={this.updateUserData} >Update</Button>

          </Form>

        </div>


      </div>

    )
  }
}

// Add anything needed in this component from the global state
let mapStateToProps = state => {
  return {
    userData: state.userData,
  }
}

