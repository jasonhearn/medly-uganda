import React, { Component } from 'react';
import Loader from './Loader'
import PatHead from './PatHead'
import PatSympTable from './PatSympTable'
import PatNotes from './PatNotes'
import Legend from './Legend'
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
		var url_cont = '/api/getAllContacts'

		fetch(url_cont,request)
			.then(res => res.json())
			.then(data => {
				var contacts = [];
				var contact;
				for (var i=0; i<data.length; i++) {
					contact = {
						surname: data[i].surname,
						firstname: data[i].firstname,
						phone: data[i].phone,
					}
					contacts.push(contact)
				}
				this.setState({ contacts: contacts })
			}
		)

		// GET INDIVIDUAL INFO
		var phone = this.props.match.params.phone
		var phone_query = '%2B' + phone.substr(1)
		var url_ind = '/api/getContact?phone=' + phone_query

		fetch(url_ind,request)
			.then(res => res.json())
  			.then(data => {
  				var ind_dict = {
	  				firstname: data[0].firstname,
					surname: data[0].surname,
					dob : data[0].dob,
					sex : data[0].sex,
					phone : data[0].phone,
					lang : data[0].language,
					registered_on : data[0].registered_on+"T23:59:00.000"
  				}
  				this.setState({individ: ind_dict})
			}
		);

  		// GET NOTES
	    var url_notes = '/api/getNotes?phone=' + phone_query

	    fetch(url_notes, request)
	    	.then(res => res.json())
			.then(data => {
				this.setState({ notes : data })
			}
		);
	}

	componentDidUpdate(prevProps,prevState) {
		if (prevState.individ !== this.state.individ) {

			// SET AUTHENTICATION CREDENTIALS
			var token = localStorage.getItem('token');
	 	    var request = {
				headers: {
					'Authorization': 'Bearer '+token
				}
	 	    }

			// GET RUNS
			var phone = this.props.match.params.phone
			var phone_query = '%2B' + phone.substr(1)
			var contact = this.state.individ.uuid // Unique patient identifier;
			var after = this.state.individ.registered_on.substr(0,10)+"T23:59:00.000" // Date after which runs are returned
			var flow = "d986b131-8d47-4f0d-a4c9-f1a168c16ee4" // Unique flow identifier
			var url_runs = '/runsByPhone?contact=' + contact + '&after=' + after;

			fetch(url_runs, request)
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

	render() {
		if (!this.isEmpty(this.state.contacts) && !this.isEmpty(this.state.runs) && !this.isEmpty(this.state.individ) && !this.isEmpty(this.state.notes)) {
			return (
				<div className="MiddleTop">
					<PatHead individ={this.state.individ} contacts={this.state.contacts}/>
					<PatSympTable runs={this.state.runs} />
					<PatNotes phone={this.props.match.params.phone} runs={this.state.runs} notes={this.state.notes} />
					<Legend />
					<Logos />
				</div>
			);
		} else if (this.state.completed && !this.isEmpty(this.state.contacts) && !this.isEmpty(this.state.individ)) {
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
				<Loader />
			);	
		}
	}
}

export default Patient;