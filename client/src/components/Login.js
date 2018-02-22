import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link, Route, Router, Redirect, Switch } from "react-router-dom"
import uhi from "../pictures/uhi.png";
import PatSearch from "./PatSearch"
import Logos from "./Logos"
import '../styles/main.css';

// There are three possible states for our login
// process and we need actions for each of them
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

function requestLogin(username,password) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    username: {username},
  }
}

function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: user.id_token
  }
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.getAuth = this.getAuth.bind(this);
    this.checkAuth = this.checkAuth.bind(this);

    this.state = { 
      res: {},
      username: '',
      password: '',
      usernameValid: false,
      passwordValid: false }
  }

  getAuth() {
    fetch('/auth', { 
      headers: { 
        'Authorization': 'Basic '+btoa(this.state.username+':'+this.state.password) } })
      .then(res => res.json())
      .then(data => localStorage.setItem('token', data.token));

    this.checkAuth()
  }

  checkAuth() {
  
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    if (value.length >= 6) {
      this.setState({ [name]: value })
      if (name === 'username') { 
        this.setState({ usernameValid : true }) } else {
        this.setState({ passwordValid : true }) }
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
            <FormGroup className="FormBlock">
              <ControlLabel>Username:</ControlLabel>
              <FormControl
                autoFocus
                name="username"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup className="FormBlock">
              <ControlLabel>Password:</ControlLabel>
              <FormControl
                autoFocus
                name="password"
                type="password"
                onChange={this.handleChange}
              />
            </FormGroup>

            <Button className="HorizButton" 
            disabled={!(this.state.usernameValid && this.state.passwordValid)}
            onClick={() => { this.getAuth() } }
            >
              Login</Button>

          </form>

        </div>

        <Logos />

      </div>
    );
  }
}

export default Login;