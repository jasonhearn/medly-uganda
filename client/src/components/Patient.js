import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom"
import PatHead from './PatHead'
import '../styles/main.css';

class Patient extends Component {
  render() {
    return (
    	<div className="Scroll">
    		<PatHead />
    	</div>
    	);
    }
}

export default Patient;