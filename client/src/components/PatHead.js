import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
import LogoutButton from './LogoutButton'
import '../styles/main.css';

class ChangePt extends Component {
	render() {
		var dropList = [];
		var contact, searchText;
		const contacts = this.props.contacts;
		for (var i=0; i<Object.keys(contacts).length; i++) {
			contact = contacts[i].name.split(' ')[1].toUpperCase() + ', ' + contacts[i].name.split(' ')[0][0] + '.'
			dropList.push(
				<li key={i}>
					<Link to={'/patient/'+contacts[i].phone} className="Sublist">
						{contact}
					</Link>
				</li>
			)
		}
		searchText = 'Browse patients'
		dropList.push(
			<li key="last'">
				<Link to={'/patbrowse'} className="Sublist">
					{searchText}
				</Link>
			</li>
		)
		
		return(
			<div className="dropdown">
		  		<Button className="ChangePtButton">Change Patient</Button>
		  		<div className="dropdownContent">
		  			{dropList}
		  		</div>
		  	</div>
		)
	}
}

class PatHead extends Component {
	render() {
		return(
			<main>
				<header>
					<div className="Logout">
				  	  <ChangePt contacts={this.props.contacts}/>
				  	  <LogoutButton />
			        </div>
				  <div className="HeadName">
				  	<h1> {this.props.individ.lname}, {this.props.individ.fname} </h1>
				  </div>
				  <h2> Age: {this.props.individ.age} | Sex: {this.props.individ.sex} | Language: {this.props.individ.lang} | Phone: {this.props.individ.phone} </h2>
				</header>
			</main>
		)
	}
}

export default PatHead;
