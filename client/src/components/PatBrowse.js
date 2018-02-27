import React, { Component } from 'react';
import { FormGroup, FormControl } from "react-bootstrap";

import { Link } from "react-router-dom"
import LogoutButton from './LogoutButton'
import Logos from './Logos'
import sort from '../pictures/sort.png'

import '../styles/main.css';

class BrowseHead extends Component {
	filtTable() {
	  // Declare variables 
	  var input, filter, table, tr, td, i;
	  input = document.getElementById("search");
	  filter = input.value.toUpperCase()
	  table = document.getElementById("PtTable");
	  tr = table.getElementsByTagName("tr");

	  // Loop through all table rows, and hide those who don't match the search query
	  for (i = 0; i < tr.length; i++) {
	    td = tr[i].getElementsByTagName("td")[0];
	    if (td) {
	      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
	        tr[i].style.display = "";
	      } else {
	        tr[i].style.display = "none";
	      }
	    } 
	  }
	}

	render() {
		return(
			<header>
				<h1> Patient Search </h1>
				<div className="PatientSearch">
					<FormGroup className="BrowseBlock">
	              		<FormControl
	                	autoFocus
	                	id="search"
	                	type="text"
	                	placeholder="Search by last name or phone number"
	                	onChange={ ()=>{ this.filtTable() } }
	              		/>
	            	</FormGroup>
	            </div>
			</header>
		);
	}
}

class BrowseBody extends Component {
	sortTable() {
	  var table, rows, switching, i, x, y, shouldSwitch;
	  table = document.getElementById("PtTable");
	  switching = true;
	  /* Make a loop that will continue until
	  no switching has been done: */
	  while (switching) {
	    // Start by saying: no switching is done:
	    switching = false;
	    rows = table.getElementsByTagName("tr");
	    /* Loop through all table rows (except the
	    first, which contains table headers): */
	    for (i = 1; i < (rows.length - 1); i++) {
	      // Start by saying there should be no switching:
	      shouldSwitch = false;
	      /* Get the two elements you want to compare,
	      one from current row and one from the next: */
	      x = rows[i].getElementsByTagName("td")[0];
	      y = rows[i + 1].getElementsByTagName("td")[0];
	      // Check if the two rows should switch place:
	      if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
	        // I so, mark as a switch and break the loop:
	        shouldSwitch = true;
	        break;
	      }
	    }
	    if (shouldSwitch) {
	      /* If a switch has been marked, make the switch
	      and mark that a switch has been done: */
	      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
	      switching = true;
	    }
	}
}

	render() {
		if (typeof(this.props.values) !== 'undefined') {
			var rows = [];
			rows.push(
				<tr key={0}>
					<th onClick={ ()=>{ this.sortTable() } }>
						Family name
						<img src={sort} 
						style={{
							height: '15px', 
							marginLeft: '10px',
							marginBottom: '-2px'}} 
						alt="" />
					</th>
					<th>Given name</th>
					<th>Sex</th>
					<th>Age</th>
					<th>Phone</th>
				</tr>
				);
			for (var i=0; i<Object.keys(this.props.values).length; i++) {
				const vals = this.props.values[i]
				rows.push(
					<tr key={i+1}>
						<td>
							<Link to={'/patient/'+vals.urns["0"].substr(4)} className="link" style={{fontWeight: '700'}}>
								{vals.name.split(' ')[1].toUpperCase()}
							</Link>
						</td>
						<td>{vals.name.split(' ')[0]}</td>
						<td>{vals.fields.sex}</td>
						<td>{vals.fields.age}</td>
						<td>{vals.urns["0"].substr(4)}</td>
					</tr>
				);
			}

			return (
				<div className="TableBlock">
					<h1>PATIENT LIST</h1>
					<table id="PtTable">
						{rows}
					</table>
				</div>
				);

		} else {
			return(
				<div className='Middle'> </div>
			)
		}
	}
}

class PatBrowse extends Component {
	constructor(props) { 
		super(props)
		this.state = { 
			data: {},
		}
	}

	componentDidMount() {
		var url = '/contacts';

		fetch(url)
			.then(res => res.json())
			.then(data => this.setState({ data : data[0].results }))
	}

	render() {
		return (
			<main>
				<div className="MiddleTop">
					<div className="Logout">
				  		<LogoutButton />
			        </div>
					<BrowseHead />
		         	<BrowseBody values={this.state.data} />
		         	<Logos />
				</div>
			</main>
		);
	}
}

export default PatBrowse;