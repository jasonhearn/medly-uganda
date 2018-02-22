import React, { Component } from 'react'

import uhi from "../pictures/uhi.png";
import ehealth from "../pictures/ehealth.png";
import uincd from "../pictures/uincd.png";
import tedrogers from "../pictures/tedrogers.png";

import '../styles/main.css';

class Logos extends Component {
	render() {
		return (
			<div className="Thumbs">
	         		<img className="Picture" src={uhi} alt="" />
	         		<img className="Picture" src={ehealth} alt="" />
	         		<img className="Picture" src={uincd} alt=""/>
	         		<img className="Picture" src={tedrogers} alt=""/>
	        </div>
	    )
	}
}

export default Logos;