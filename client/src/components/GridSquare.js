import React, { Component } from 'react'

class GridSquare extends Component {
	render() {
		var tx, col;
		if (this.props.text === "Yes") { 
			tx = ""; col = '#3FB0F1'
		} else if (this.props.text === "No") { 
			tx = ""; col = '#FFFFFF'
		} else if (this.props.text === "Critical") {
			tx = "H"; col = '#FF1D00';
		} else if (this.props.text === "Urgent") {
			tx = "\u00b7\u00b7\u00b7"; col = '#FF1D00';
		} else if (this.props.text === "Urgent with fluid") {
			tx = "\u00b7\u00b7\u00b7"; col = '#FF1D00';
		} else if (this.props.text === "Fluid") {
			tx = "\u00b7\u00b7"; col = '#FFFE06';
		} else if (this.props.text === "Tired") {
			tx = "\u00b7\u00b7"; col = '#FFFE06';
		} else if (this.props.text === "Normal") {
			tx = "\u00b7"; col = '#91D150';
		} else {
			tx = ""; col = 'rgba(0, 0, 0, 0)'
		}
		
		return(
			<div className={this.props.class} title={this.props.text} style={{background: col}}>{tx}</div>
		);
	}
}

export default GridSquare;