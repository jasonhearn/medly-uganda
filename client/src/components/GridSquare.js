import React, { Component } from 'react'

class GridSquare extends Component {
	render() {
		var ti, tx, col;
		if (this.props.text === "Yes") { 
			ti = this.props.text; tx = ""; col = '#3FB0F1'
		} else if (this.props.text === "No") { 
			ti = this.props.text; tx = ""; col = '#FFFFFF'
		} else if (this.props.text === "Critical") {
			ti = "Critical"; tx = "H"; col = '#FF1D00';
		} else if (this.props.text === "Urgent") {
			ti = "High risk"; tx = "\u00b7\u00b7\u00b7"; col = '#FF1D00';
		} else if (this.props.text === "Urgent with fluid") {
			ti = "High risk"; tx = "\u00b7\u00b7\u00b7"; col = '#FF1D00';
		} else if (this.props.text === "Fluid") {
			ti = "Moderate risk"; tx = "\u00b7\u00b7"; col = '#FFFE06';
		} else if (this.props.text === "Tired") {
			ti = "Moderate risk"; tx = "\u00b7\u00b7"; col = '#FFFE06';
		} else if (this.props.text === "Normal") {
			ti = "Low risk"; tx = "\u00b7"; col = '#91D150';
		} else {
			ti = "No response"; tx = ""; col = 'rgba(0, 0, 0, 0)'
		}
		
		return(
			<div className={this.props.class} title={ti} style={{background: col}}>{tx}</div>
		);
	}
}

export default GridSquare;