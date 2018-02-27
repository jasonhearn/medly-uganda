import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
import LogoutButton from './LogoutButton'
import '../styles/main.css';

class ChangePt extends Component {
	componentDidMount() {
		var url = '/proxy/api/v2/contacts.json';
		var group = 'Patients'
		var query = url + '?group=' + group

		fetch(query)
			.then(res => res.json())
			.then(data => this.setState({ data : data.results }))
	}

	componentDidUpdate(prevProps,prevState) {
		if (prevState === null || prevState.data !== this.state.data) {
			var contacts = [];
			var contact
			const vals = this.state.data
			for (var i=0; i<Object.keys(this.state.data).length; i++) {
				contact = vals[i].name.split(' ')[1].toUpperCase() + ', ' + vals[i].name.split(' ')[0]
				contacts.push(
					<li>
						<a><Link to={'/patient/'+vals[i].urns["0"].substr(4)}>
							{contact}
						</Link></a>
					</li>
				)
			}
			contacts.push(
				<li>
					<a><Link to={'/patsearch'}>
						Search by phone number
					</Link></a>
				</li>
			)
			console.log(contacts)
			this.setState({ contacts: contacts})
		}
	}

	render() {
		console.log(this.state)
		if (this.state !== null) {
			return(
				<div className="dropdown">
			  		<Button className="ChangePtButton">Change patient</Button>
			  		<div className="dropdownContent">
			  			{this.state.contacts}
			  		</div>
			  	</div>
			)
		} else {
			return(
				<div className='dropdown'> </div>
			)
		}
	}
}

class PatHead extends Component {

	state = { name: '',
			  fname: '',
			  lname: '',	
			  age: '',
			  sex: '',
			  lang: '',
			  phone: '',
			}

	componentDidMount() {
		var url = '/proxy/api/v2/contacts.json';
		var phone = this.props.phone;
		var query = url + '?urn=tel:' + phone

		fetch(query)
  			.then(res => res.json())
  			.then(data => this.setState({ name : data.results["0"].name,
  										  age : data.results["0"].fields.age,
  										  sex : data.results["0"].fields.sex,
  										  phone : data.results["0"].urns["0"].substr(4),
  										  lang : data.results["0"].language }));
	}

	componentDidUpdate(prevProps,prevState) {
		if (prevState.name !== this.state.name) {
			this.setState({ fname: this.state.name.split(' ')[0] })
			this.setState({ lname: this.state.name.split(' ')[1].toUpperCase() })
		}
	}

	render() {
		if (this.state.fname !== '') {
			return(
				<main>
					<header>
						<div className="Logout">
					  	  <ChangePt />
					  	  <LogoutButton />
				        </div>
					  {/* We will eventually call API to get actual values here */}
					  <div className="HeadName">
					  	<h1> {this.state.lname}, {this.state.fname} </h1>
					  </div>
					  <h2> Age: {this.state.age} | Sex: {this.state.sex} | Language: {this.state.lang} | Phone: {this.state.phone} </h2>
					</header>
				</main>
			)
		} else {
			return(
				<div className='Middle'> </div>
			)
		}
	}
}

export default PatHead;
