import React, { Component } from 'react';
import { FormGroup, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom"
import LogoutButton from './LogoutButton'
import ReturnButton from './ReturnButton'
import Logos from './Logos'
import sort from '../pictures/sort.png'
import moment from 'moment';

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
	                	placeholder="Search by surname or phone number"
	                	onChange={ ()=>{ this.filtTable() } }
	              		/>
	            	</FormGroup>
	            </div>
			</header>
		);
	}
}

class BrowseBody extends Component {
	sortTable(n) {
	  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	  table = document.getElementById("PtTable");
	  switching = true;
	  // Set the sorting direction to ascending:
	  dir = "asc"; 
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
	      x = rows[i].getElementsByTagName("td")[n];
	      y = rows[i + 1].getElementsByTagName("td")[n];
	      /* Check if the two rows should switch place,
	      based on the direction, asc or desc: */
	      if (dir === "asc") {
	        if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
	          // If so, mark as a switch and break the loop:
	          shouldSwitch= true;
	          break;
	        }
	      } else if (dir === "desc") {
	        if (x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
	          // If so, mark as a switch and break the loop:
	          shouldSwitch = true;
	          break;
	        }
	      }
	    }
	    if (shouldSwitch) {
	      /* If a switch has been marked, make the switch
	      and mark that a switch has been done: */
	      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
	      switching = true;
	      // Each time a switch is done, increase this count by 1:
	      switchcount ++; 
	    } else {
	      /* If no switching has been done AND the direction is "asc",
	      set the direction to "desc" and run the while loop again. */
	      if (switchcount === 0 && dir === "asc") {
	        dir = "desc";
	        switching = true;
	      }
	    }
	  }
	}

	render() {
			var rows = [];
			rows.push(
			<tr key={-1}>
				<th onClick={ ()=>{ this.sortTable(0) } } width='30%'>
					Surname
					<img src={sort} 
						className='SortIcon' 
						alt=""
					/>
				</th>
				<th onClick={ ()=>{ this.sortTable(1) } } width='25%'>
					First name
					<img src={sort} 
						className='SortIcon' 
						alt="" 
					/>
				</th>
				<th width='10%'>Sex</th>
				<th width='10%'>Age</th>
				<th width='25%'>Phone</th>
			</tr>
			);
			
			for (var i=0; i<Object.keys(this.props.values).length; i++) {
				const vals = this.props.values[i]
				var age = moment(vals.dob, "YYYY-MM-DD").fromNow();
				age = age.split(" ")[0]
				var phone = vals.phone.substr(4)
					rows.push(
						<tr key={i+1}>
							<td>
								<Link to={'/patient/'+vals.phone} className="Link">
									{vals.surname}
								</Link>
							</td>
							<td>{vals.firstname}</td>
							<td>{vals.sex}</td>
							<td>{age}</td>
							<td>{phone}</td>
						</tr>
					);
			}

			return (
				<div className="TableBlock">
					<h1>PATIENT LIST</h1>
					<table id="PtTable">
						<tbody>{rows}</tbody>
					</table>
				</div>
				);
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
		// var group = 'Patients'
		// var url = '/contByGroup?group=' + group
		var url = '/getAllContacts'
		var token = localStorage.getItem('token');

	    var request = {
			headers: {
				'Authorization': 'Bearer '+token
			}
	    }

		fetch(url,request)
			.then(res => res.json())
			.then(data => {
					data = data.sort(function(a, b){
				    var keyA = a.surname,
				        keyB = b.surname;
				    // Compare the 2 names
				    if (keyA < keyB) return -1;
				    if (keyA > keyB) return 1;
				    return 0;
				});
				this.setState({ data : data })
			}
		);
	}

	render() {
		if (!!this.state.data) {
			return (
				<main>
					<div className="MiddleTop">
						<div className="Logout">
					  		<ReturnButton />
					  		<LogoutButton />
				        </div>
						<BrowseHead />
			         	<BrowseBody values={this.state.data} />
			         	<Logos />
					</div>
				</main>
			);
		} else {
			return(
				<div className='Middle'> </div>
			);
		}
	}
}

export default PatBrowse;