import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom"
import uhi_logo from "../pictures/uhi-logo.png";
import '../styles/main.css';

class PatSearch extends Component {
  render() {
    return (
      <div className="Middle">
        <h1>Enter your patient&#39;s phone number.</h1>

        <div className="LoginBlock">
          <form>
            <FormGroup controlId="patient" bsSize="large">
              <ControlLabel>Phone:</ControlLabel>
              <FormControl
                autoFocus
                type="textnum"
                placeholder="720123456"
                // value={this.state.username}
                // onChange={this.handleChange}
              />
            </FormGroup>

            <Link to='/patient'>
              <Button className="Button" type="submit">OK</Button>
            </Link>

          </form>

        </div>

        <h2>Don't know the phone number? <Link to='/'>Browse your patients</Link>.</h2>
        <img className="UHI" src={uhi_logo} />

      </div>
    );
  }
}

export default PatSearch;
