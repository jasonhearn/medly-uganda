import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { Link } from "react-router-dom"
import Logos from './Logos'

import uhi from "../pictures/uhi.png";
import ehealth from "../pictures/ehealth.png";
import uincd from "../pictures/uincd.png";
import tedrogers from "../pictures/tedrogers.png";

import '../styles/main.css';

class BrowseHead extends Component {
	render() {
		return(
			<header>
				<h1> Patient Search </h1>
				<div className="PatientSearch">
					<FormGroup className="BrowseBlock">
	              		<FormControl
	                	autoFocus
	                	type="text"
	                	placeholder="Search patients"
	              		/>
	            	</FormGroup>
	            	<Button className="VertButton" type="submit">OK</Button>
	            </div>
			</header>
		);
	}
}

class BrowseBody extends Component {
	render() {
		if (typeof(this.props.values) != 'undefined') {
			var rows = [];
			rows.push(
				<tr key={0}>
					<th>Family name</th>
					<th>Given name</th>
					<th>Sex</th>
					<th>Age</th>
					<th>Phone</th>
				</tr>
				);
			for (var i=0; i<Object.keys(this.props.values).length; i++) {
				const vals = this.props.values[i]
				rows.push(
					<tr key={i+1}>
						<td>
							<Link to={'/patient/'+vals.urns["0"].substr(4)} className="link">
								{vals.name.split(' ')[1].toUpperCase()}
							</Link>
						</td>
						<td>{vals.name.split(' ')[0]}</td>
						<td>{vals.fields.sex}</td>
						<td>{vals.fields.age}</td>
						<td>{vals.urns["0"].substr(4)}</td>
					</tr>
				);
			}

			return (
				<div className="TableBlock">
					<h1>PATIENT LIST</h1>
					<table>
						{rows}
					</table>
				</div>
				);

		} else {
			return(
				<div className='Middle'> </div>
			)
		}
	}
}

class PatBrowse extends Component {
	constructor(props) { 
		super(props)
		this.state = { 
			data: {},
		}
	}

	componentDidMount() {
		var url = '/contacts';

		fetch(url)
			.then(res => res.json())
			.then(data => this.setState({ data : data[0].results }))
	}

	render() {
		return (
			<div className="MiddleTop">
				<BrowseHead />
	         	<BrowseBody values={this.state.data} />
	         	<Logos />
			</div>
		);
	}
}

export default PatBrowse;