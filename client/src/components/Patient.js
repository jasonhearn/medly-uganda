import React, { Component } from 'react';
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
			notes: {},
			completed: false,
			loading: true
		}
	}

	isEmpty(obj) {
		if (obj === undefined || Object.keys(obj).length === 0) {
			return true;
		} else {
			return false;
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
						phone: vals[i].urns["0"].substr(4),
					}
					contacts.push(contact)
				}
				this.setState({ contacts: contacts })
			}
		)

		// GET INDIVIDUAL INFO
		var phone = this.props.match.params.phone
		var url_ind = '/contByPhone?phone=' + phone

		fetch(url_ind,request)
			.then(res => res.json())
  			.then(data => {
  				var ind_dict = {
	  				fname: data.results[0].name.split(' ')[0],
					lname: data.results[0].name.split(' ')[1].toUpperCase(),
					age : data.results[0].fields.age,
					sex : data.results[0].fields.sex,
					phone : data.results[0].urns["0"].substr(4),
					lang : data.results[0].language,
					uuid : data.results[0].uuid,
					registered_on : data.results[0].fields.registered_on.substr(0,19)+".000"
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

	componentDidUpdate(prevProps,prevState) {
		if (prevState.individ !== this.state.individ) {

			// // SET AUTHENTICATION CREDENTIALS
			// var token = localStorage.getItem('token');
		 //    var request = {
			// 	headers: {
			// 		'Authorization': 'Bearer '+token
			// 	}
		 //    }

			// GET RUNS
			// // This will eventually be replaced by actual API call once data is available
			// var contact = "6c45471e-829d-4f8a-b948-78f7d988ebfc" //this.state.individ.uuid // Unique patient identifier;
			// var after = "2018-01-15T23:59:00.000" // this.state.individ.registered_on // Date after which runs are returned
			var flow = "fe72849f-7d3f-41a4-b677-cef7c24ecf16" // Unique flow identifier

			// var url_runs = '/runsByUUID?contact='+contact+'&after='+after;
			var url_runs = '/runs';

			fetch(url_runs)//, request)
				.then(res => res.json())
				.then(data => {
					var tmp_val = {}
					for (var i = 0; i < Object.keys(data.results).length; i++) {
						// Continue in loop if data is not from main USSD flow or if flow was not completed
						if (data.results[i].flow.uuid !== flow || data.results[i].exit_type !== "completed") {
							continue
						}

						// For main USSD flow results, add value to running object
						var tmp_dict = data.results[i].values
						var var_keys = Object.keys(tmp_dict)
						tmp_val[i] = {}
						tmp_val[i]['date'] = data.results[i].exited_on.substr(2,8)
						for (var j = 0; j < var_keys.length; j++) {
							tmp_val[i][var_keys[j]] = tmp_dict[var_keys[j]]['category']
						}
					}
					this.setState({ 
						runs : tmp_val,
						completed: true // Set flag noting that run fetch has been completed, for case where tmp_val is updated but still empty (i.e. no symptoms reported)
					})
				}
			)
		}
	}

	render() {
		if (!this.isEmpty(this.state.contacts) && !this.isEmpty(this.state.runs) && !this.isEmpty(this.state.individ) && !this.isEmpty(this.state.notes)) {
			return (
				<div className="MiddleTop">
					<PatHead individ={this.state.individ} contacts={this.state.contacts}/>
					<PatSympTable runs={this.state.runs} />
					<PatNotes phone={this.props.match.params.phone} runs={this.state.runs} notes={this.state.notes} />
					<Logos />
				</div>
			);
		} else if (this.state.completed && !this.isEmpty(this.state.contacts) && !this.isEmpty(this.state.individ) && !this.isEmpty(this.state.notes)) {
			return (
				<div className="MiddleTop">
					<PatHead individ={this.state.individ} contacts={this.state.contacts}/>
					<div className="TableBlock">
						<h1 style={{paddingTop: '5%'}} >This patient has yet to report any symptoms.</h1>
					</div>
					<Logos />
				</div>
			);
		} else {
			return(
				<div className="Middle"></div>
			)	
		}
	}
}

export default Patient;