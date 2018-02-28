import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
import LogoutButton from './LogoutButton'
import '../styles/main.css';

class ChangePt extends Component {
	componentDidMount() {
		var group = 'Patients'
		var url = '/contByGroup?group=' + group

		var token = localStorage.getItem('token');

	    var request = {
			headers: {
				'Authorization': 'Bearer '+token
			}
	    }

		fetch(url,request)
			.then(res => res.json())
			.then(data => this.setState({ data : data.results }))
	}

	componentDidUpdate(prevProps,prevState) {
		if (prevState === null || prevState.data !== this.state.data) {
			var contacts = [];
			var contact
			var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			const vals = this.state.data
			for (var i=0; i<Object.keys(this.state.data).length; i++) {
				if (width > 700) {
					contact = vals[i].name.split(' ')[1].toUpperCase() + ', ' + vals[i].name.split(' ')[0]
				} else {
					contact = vals[i].name.split(' ')[1].toUpperCase() + ', ' + vals[i].name.split(' ')[0][0] + '.'
				}
				
				contacts.push(
					<li>
						<a><Link to={'/patient/'+vals[i].urns["0"].substr(4)}>
							{contact}
						</Link></a>
					</li>
				)
			}
			if (width > 700) { var searchText = 'Search by phone number' } else { var searchText = 'Search by phone' }
			contacts.push(
				<li><a><Link to={'/patsearch'}>
						{searchText}
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
			  		<Button className="ChangePtButton">Change Patient</Button>
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
