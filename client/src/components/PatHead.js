import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/main.css';

class PatHead extends Component {

	constructor() {
		super();
		this.state = {data: {} };
	}

	componentDidMount() {
		var invocation = new XMLHttpRequest();
		var url = 'https://api.textit.in/api/v2/contacts.json';
		var header = { "Authorization": "Token f3cfe4509225eea931254f4368cb3ebb003c618e" }

		function callOtherDomain() {
			if(invocation) {
				invocation.open(
					'GET', 
					url, 
					header = header
					);
				invocation.onreadystatechange = handler;
				invocation.send();
			}
		}
	}

	render() {
		return(
			<header>
			  {/* We will eventually call API to get actual values here */}
			  <h1> {'Bakabulindi'.toUpperCase()}, Jason </h1>
			  <h2> Age: 48 | Sex: M | Language: Runyankore | Phone: +256-751-491858 </h2>
			</header>
		)
	}
}

export default PatHead;
