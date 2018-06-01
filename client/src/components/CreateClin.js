import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Redirect } from "react-router-dom"
import Logos from "./Logos"
import LogoutButton from './LogoutButton'
import ReturnButton from './ReturnButton'
import username from "../pictures/username.png"
import password from "../pictures/password.png"
import '../styles/main.css';
var dateFormat = require('dateformat')

class CreateClin extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);

    this.state = { 
      success: false,
      username: "",
      password: "",
      password2: ""
    }
  }

  handleChange(e) {
    const name = e.target.name;
    var value = e.target.value;

    this.setState({ [name]: value })
  }

  checkVal() {
    if(this.state.username !== "" & 
      this.state.password !== "" &
      this.state.password2 === this.state.password) {
      return true
    } else {
      return false
    }
  }

  createClin() {
    var created_on = dateFormat((new Date(), "isoDateTime"))

    var userObj = {
      username: this.state.username,
      password: this.state.password,
      created_on: created_on
    };

    var payload = JSON.stringify(userObj)
    var token = localStorage.getItem('token');

    var request = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer '+token,
        'Content-Type': 'application/json'
      },
      body: payload
    }

    fetch('/api/createClin', request)
      .then(res => {
        if (res.status === 200) {
          this.setState({ success: true })
        }
      })
  }

  render() {
    if (this.state.success) {
      return <Redirect push to="/search" />;
    } else {      
      return (
        <main>
          <div className="MiddleTop">
            <header>
              <div className="Logout">
                <ReturnButton />
                <LogoutButton />
              </div>
            </header>
          </div>
          <div className="Middle">
            <h1>Enter the clinician's credentials.</h1>
            
            <div className="CreateBlock">
              <FormGroup className="CreateForm">
                <ControlLabel>
                  <img 
                    src={username} 
                    className='CreateIcon' 
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

              <FormGroup className="CreateForm">
                <ControlLabel>
                  <img 
                    src={password} 
                    className='CreateIcon' 
                    alt="" 
                  />
                </ControlLabel>
                <FormControl
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={this.handleChange}
                />
              </FormGroup>

              <FormGroup className="CreateForm">
                <ControlLabel>
                  <img 
                    src={password} 
                    className='CreateIcon' 
                    alt="" 
                  />
                </ControlLabel>
                <FormControl
                  name="password2"
                  type="password"
                  placeholder="Confirm password"
                  onChange={this.handleChange}
                />
              </FormGroup>

            </div>

            <Button 
              className="CreateButton" 
              disabled={!this.checkVal()}
              onClick={() => { 
                this.createClin() 
                this.setState({ success: true })
              }}
            >
              OK
            </Button>

            <Logos />

          </div>
        </main>
      );
    }
  }
}

export default CreateClin;