import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom"
import Logos from "./Logos"
import username from "../pictures/username.png"
import password from "../pictures/password.png"
import '../styles/main.css';

class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.getAuth = this.getAuth.bind(this);

    this.state = { 
      res: {},
      username: '',
      password: '',
      usernameValid: false,
      passwordValid: false }
  }

  getAuth(name,value) {
    var details = {
        name: name,
        password: value
      }

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

    console.log(request)

    fetch('/auth', request)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('token',data.token)
        localStorage.setItem('status',data.message)
      }
    )
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    if (value.length >= 6) {
      this.setState({ [name]: value })
      if (name === 'username') { 
        this.setState({ usernameValid : true }) 
        if (this.state.passwordValid === true) {
          this.getAuth(value,this.state.password)
        }
      } else {
        this.setState({ passwordValid : true }) 
        console.log(value)
        if (this.state.usernameValid === true) {
          this.getAuth(this.state.username,value)
        }
      }
    } else {
      if (name === 'username') { 
        this.setState({ usernameValid : false }) } else {
        this.setState({ passwordValid : false }) }
    }

  }

  render() {
    return (
      <div className="Middle">
        <h1>Welcome to the Medly Dashboard.</h1>
        <div className="LoginBlock">
          <form>
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
                autoFocus
                name="password"
                type="password"
                placeholder="Password"
                onChange={this.handleChange}
              />
            </FormGroup>

          </form>

        </div>

        <Link to='/patsearch'>
          <Button className="HorizButton" 
          disabled={!(this.state.usernameValid && this.state.passwordValid)}
          >
            Login
          </Button>
        </Link>

        <Logos />

      </div>
    );
  }
}

export default Login;