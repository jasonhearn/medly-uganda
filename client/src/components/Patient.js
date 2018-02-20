import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom"
import PatHead from './PatHead'
import '../styles/main.css';

class Square extends Component {
	render() {
		if (this.props.present === "Yes") {
			var blockStyle = {
				height: 150,
				backgroundColor: "3FB0F1"
			};
		}
	
		return(
			<div style={blockStyle}>
			</div>
		)
	}
}

class Patient extends Component {
	constructor(props) { 
		super(props)
		this.state = { 
			data : {},
			values: {} 
		}
	}

	componentDidMount() {
		var url = '/runs';

		fetch(url)
			.then(res => res.json())
			.then(data => this.setState({ data : data }))
	}

	componentDidUpdate(prevProps,prevState) {
		if (prevState.data !== this.state.data) {
			var tmp_val = {}
			for (var i = 0; i < Object.keys(this.state.data).length; i++) {
				var tmp_dict = this.state.data[i].results[0].values
				var var_keys = Object.keys(tmp_dict)
				tmp_val[i] = {}
				for (var j = 0; j < var_keys.length; j++) {
					tmp_val[i][var_keys[j]] = tmp_dict[var_keys[j]]['category']
				}
			}
			this.setState({values : tmp_val})
		}
	}

	render() {
		console.log(this.state.values[0])
		return (
			<div>
				<PatHead />
				
			</div>
			);
	}
}

export default Patient;