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
	         		<img className="Picture" src={uhi} />
	         		<img className="Picture" src={ehealth} />
	         		<img className="Picture" src={uincd} />
	         		<img className="Picture" src={tedrogers} />
	        </div>
	    )
	}
}

export default Logos;