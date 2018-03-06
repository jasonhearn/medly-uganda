import React, { Component } from 'react';
import { Link } from "react-router-dom"
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
			runs: {},
			contacts: {},
			individ: {},
			notes: {}
		}
	}

	componentDidMount() {
		// SET AUTHENTICATION CREDENTIALS
		var token = localStorage.getItem('token');
	    var request = {
			headers: {
				'Authorization': 'Bearer '+token
			}
	    }

		// GET RUNS
		// This will be replaced by actual API call once data is available
		var url_runs = '/runs';

		fetch(url_runs)
			.then(res => res.json())
			.then(data => {
				var tmp_val = {}
				for (var i = 0; i < Object.keys(data).length; i++) {
					var tmp_dict = data[i].results[0].values
					var var_keys = Object.keys(tmp_dict)
					tmp_val[i] = {}
					tmp_val[i]['date'] = data[i].results[0].exited_on.substr(2,8)
					for (var j = 0; j < var_keys.length; j++) {
						tmp_val[i][var_keys[j]] = tmp_dict[var_keys[j]]['category']
					}
				}
				this.setState({ runs : tmp_val })
			}
		)

		// GET CONTACTS
		var group = 'Patients'
		var url_cont = '/contByGroup?group=' + group

		fetch(url_cont,request)
			.then(res => res.json())
			.then(data => {
				var contacts = [];
				var contact;
				const vals = data.results;
				for (var i=0; i<Object.keys(vals).length; i++) {
					contact = {
						name: vals[i].name,
						phone: vals[i].urns["0"].substr(4)
					}
					contacts.push(contact)
				}
				this.setState({ contacts: contacts})
			}
		)

		// GET INDIVIDUAL INFO
		var phone = this.props.match.params.phone
		var url_ind = '/contByPhone?phone=' + phone

		fetch(url_ind,request)
			.then(res => res.json())
  			.then(data => {
  				var ind_dict = {
	  				fname: data.results["0"].name.split(' ')[0],
					lname: data.results["0"].name.split(' ')[1].toUpperCase(),
					age : data.results["0"].fields.age,
					sex : data.results["0"].fields.sex,
					phone : data.results["0"].urns["0"].substr(4),
					lang : data.results["0"].language 
  				} 
  				this.setState({individ: ind_dict})
			}
		);

  		// GET NOTES
  		var phone_notes = phone.substr(1);

	    var url_notes = '/getNotes?phone=' + phone_notes

	    fetch(url_notes, request)
	    	.then(res => res.json())
			.then(data => {
				this.setState({ notes : data })
			}
		);
	}

	isEmpty(obj) {
		if (obj === undefined || Object.keys(obj).length === 0) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		if (!this.isEmpty(this.state.runs) && !this.isEmpty(this.state.runs) && !this.isEmpty(this.state.individ) && !this.isEmpty(this.state.notes)) {
			return (
				<div className="MiddleTop">
					<PatHead individ={this.state.individ} contacts={this.state.contacts}/>
					<PatSympTable runs={this.state.runs} />
					<PatNotes phone={this.props.match.params.phone} runs={this.state.runs} notes={this.state.notes} />
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