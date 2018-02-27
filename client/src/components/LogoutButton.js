import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom"

class LogoutButton extends Component {
	clearLocal() {
    	localStorage.clear();
  	}	

	render() {
		return(
			<Link to={'/'}>
	            <Button 
	              className="LogoutButton" 
	              type="submit" 
	              onClick={ ()=>{ this.clearLocal() } }
	            >
	              Logout
	            </Button>
	        </Link>
		)
	}
}

export default LogoutButton;