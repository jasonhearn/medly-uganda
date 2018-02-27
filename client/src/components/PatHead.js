import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
import LogoutButton from './LogoutButton'
import '../styles/main.css';

class ChangePtButton extends Component {
	render() {
		return(
			<Link to='/patsearch'>
		  		<Button className="ChangePtButton">Change patient</Button>
		  	</Link>
		)
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
					  	  <ChangePtButton />
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
