import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
import LogoutButton from './LogoutButton'
import moment from 'moment';
import '../styles/main.css';

class ChangePt extends Component {
	render() {
		var dropList = [];
		var contact, contacts, searchText;
		const contacts_unordered = this.props.contacts;

		contacts = contacts_unordered.sort(function(a, b){
		    var keyA = a.surname,
		        keyB = b.surname;
		    // Compare the 2 names
		    if (keyA < keyB) return -1;
		    if (keyA > keyB) return 1;
		    return 0;
		});

		for (var i=0; i<Object.keys(contacts).length; i++) {
			contact = contacts[i].surname + ', ' + contacts[i].firstname.substr(0,1) + '.'
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
				<Link to={'/browse'} className="Sublist">
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

		var age = moment(this.props.individ.dob, "YYYY-MM-DD").fromNow();
		age = age.split(" ")[0]
		var phone_click = 'tel:'+this.props.individ.phone
		console.log(phone_click)

		// Get width and output header depending on value
		var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		if (width >= 700) {
			return (
				<h2> <b>Age:</b> {age} | <b>Sex:</b> {this.props.individ.sex} | <b>Language:</b> {language} | <b>Phone:</b> 0{this.props.individ.phone.substr(4,3)}-{this.props.individ.phone.substr(7,6)}</h2>
			);
		} else if (width < 700 && width >= 480) {
			return (
				<h2> <b>Age:</b> {age} | <b>Sex:</b> {this.props.individ.sex} | <b>Language:</b> {language} | <b>Phone:</b> 0{this.props.individ.phone.substr(4,3)}-{this.props.individ.phone.substr(7,6)}</h2>
			);
		} else {
			return (
				<h2> <b>Age:</b> {age} | <b>Sex:</b> {this.props.individ.sex} | <b>Lang.:</b> {language} | <b>Ph.:</b> <a href={phone_click} className="Link">0{this.props.individ.phone.substr(4,3)}-{this.props.individ.phone.substr(7,6)}</a> </h2>
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
				  	<h1> {this.props.individ.surname}, {this.props.individ.firstname} </h1>
				  </div>
				  <DemoHeader individ={this.props.individ} />
				</header>
			</main>
		)
	}
}

export default PatHead;
