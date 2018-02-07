import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "../node_modules/react-bootstrap";
import uhi_logo from "./pictures/uhi-logo.png";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Welcome to the Medly Dashboard.</h1>

        <div className="Login">
          <form>
            <FormGroup controlId="username" bsSize="large">
              <ControlLabel>Username:</ControlLabel>
              <FormControl
                autoFocus
                type="text"
                // value={this.state.username}
                // onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="username">
              <ControlLabel>Password:</ControlLabel>
              <FormControl
                autoFocus
                type="password"
                // value={this.state.password}
                // onChange={this.handleChange}
              />
            </FormGroup>

            <Button className="Button" type="submit">Login</Button>

          </form>

        </div>

        <img className="UHI" src={uhi_logo}/>

      </div>
    );
  }
}

export default App;
