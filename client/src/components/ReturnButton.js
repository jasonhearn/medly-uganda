import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../styles/main.css';

class ReturnButton extends Component {
  render() {
    return(
      <Link to={'/patientsearch'}>
        <Button 
          className="ChangePtButton" 
          type="submit" 
        >
          Return home
        </Button>
      </Link>
    )
  }
}

export default ReturnButton;