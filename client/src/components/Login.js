import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Redirect } from "react-router-dom"
import Logos from "./Logos"
import username from "../pictures/username.png"
import password from "../pictures/password.png"
import error from "../pictures/error.png"
import '../styles/main.css';

class ErrorMessage extends Component {
  render() {
    if (this.props.failed) {
      return(
        <div className='Error'>
          <img 
            src={error} 
            className='ErrorIcon' 
            alt="" 
          />
          Something isn't right. Please try again.
        </div>
      );
    } else {
      return(
        <div className='Error'> </div>
    )}
  }
}

class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.getAuth = this.getAuth.bind(this);

    this.state = { 
      res: {},
      username: '',
      password: '',
      failed: false,
      success: false,
      usernameValid: false,
      passwordValid: false }
  }

  getAuth(name,value) {
    var details = {
        username: name,
        password: value
      }

    localStorage.setItem('username',name)
    var formBody = [];

    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    var request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }

    fetch('/auth', request)
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token',data.token)
          this.setState({success: true})
        } else {
          this.setState({failed: true})
        }
      }
    )
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    if (value.length >= 5) {
      this.setState({ [name]: value })
      if (name === 'username') { 
        this.setState({ usernameValid : true }) 
      } else {
        this.setState({ passwordValid : true }) 
      }
    } else {
      if (name === 'username') { 
        this.setState({ usernameValid : false }) } else {
        this.setState({ passwordValid : false }) }
    }
  }

  keyPress(e) {
    if (e.key === 'Enter') {
      this.getAuth(this.state.username, this.state.password)
    }
  }

  render() {
    if (this.state.success) {
      return <Redirect push to="/patientsearch" />;
    } else {

      localStorage.clear();
      
      return (
        <div className="Middle">
          <h1>Welcome to the Medly dashboard.</h1>
          
          <div className="LoginBlock">
            <FormGroup className="MainForm">
              <ControlLabel>
                <img 
                  src={username} 
                  className='Icon' 
                  alt="" 
                />
              </ControlLabel>
              <FormControl
                autoFocus
                name="username"
                type="text"
                placeholder="Username"
                onChange={this.handleChange}
                onKeyPress={this.keyPress}
              />
            </FormGroup>
            <FormGroup className="MainForm">
              <ControlLabel>
                <img 
                  src={password} 
                  className='Icon'
                  alt="" 
                />
              </ControlLabel>
              <FormControl
                name="password"
                type="password"
                placeholder="Password"
                onChange={this.handleChange}
                onKeyPress={this.keyPress}
              />
            </FormGroup>
          </div>

          <Button className="HorizButton" 
            disabled={!(this.state.usernameValid && this.state.passwordValid)}
            onClick={() => { this.getAuth(this.state.username, this.state.password) }}
          >
            Login
          </Button>

          <ErrorMessage failed={this.state.failed} />

          <Logos />

        </div>
      );
    }
  }
}

export default Login;