import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import PatHead from './PatHead'
import PatSympTable from './PatSympTable'
import PatNotes from './PatNotes'
import Logos from './Logos'
import '../styles/main.css';
import '../styles/patient.css'

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
				tmp_val[i]['date'] = this.state.data[i].results[0].exited_on.substr(2,8)
				for (var j = 0; j < var_keys.length; j++) {
					tmp_val[i][var_keys[j]] = tmp_dict[var_keys[j]]['category']
				}
			}
			this.setState({values : tmp_val})
		}
	}

	render() {
		if (typeof(this.state.values[0]) !== 'undefined') {
			return (
				<div className="MiddleTop">
					<PatHead phone={this.props.match.params.phone} />
					<PatSympTable values={this.state.values} />
					<PatNotes values={this.state.values} />
					<Logos />
				</div>
			);
		} else {
			return(
				<div className='MiddleTop'> </div>
			)	
		}
	}
}

export default Patient;