import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom"
import uhi from "../pictures/uhi.png";
import PatSearch from "./PatSearch"
import '../styles/main.css';

class Login extends Component {
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
                type="text"
                // value={this.state.username}
                // onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup className="FormBlock">
              <ControlLabel>Password:</ControlLabel>
              <FormControl
                autoFocus
                type="password"
                // value={this.state.password}
                // onChange={this.handleChange}
              />
            </FormGroup>

            <Link to='/patsearch'>
              <Button className="HorizButton" type="submit">Login</Button>
            </Link>

          </form>

        </div>

        <img className="Picture" src={uhi} />

      </div>
    );
  }
}

export default Login;
