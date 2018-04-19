import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
import LogoutButton from './LogoutButton'
import moment from 'moment';
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
				<Link to={'/patientbrowse'} className="Sublist">
					{searchText}
				</Link>
			</li>
		)
		
		return(
			<div className="dropdown">
		  		<Button className="ChangePtButton">Recent Patients</Button>
		  		<div className="dropdownContent">
		  			{dropList}
		  		</div>
		  	</div>
		)
	}
}

class DemoHeader extends Component {
	

	render() {
		// Convert language abbreviation to full word
		var language;
		switch(this.props.individ.lang) {
			case 'eng':
				language = 'English';
				break;
			case 'lug':
				language = 'Luganda';
				break;
			case 'laj':
				language = 'Runyankore';
				break;
			default: 
				language = 'Unknown'
				break;

		}

		var age = moment(this.props.individ.DOB, "YYYY-MM-DD").fromNow();
		age = age.split(" ")[0]

		// Get width and output header depending on value
		var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		if (width >= 700) {
			return (
				<h2> <b>Age:</b> {age} | <b>Sex:</b> {this.props.individ.sex} | <b>Language:</b> {language} | <b>Phone:</b> {this.props.individ.phone.substr(4,3)} {this.props.individ.phone.substr(7,6)} </h2>
			);
		} else {
			return (
				<h2> <b>Age:</b> {age} | <b>Sex:</b> {this.props.individ.sex} | <b>Lang.:</b> {language} | <b>Ph.:</b> {this.props.individ.phone.substr(4,3)} {this.props.individ.phone.substr(7,6)} </h2>
			);
		}
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
				  <DemoHeader individ={this.props.individ} />
				</header>
			</main>
		)
	}
}

export default PatHead;
