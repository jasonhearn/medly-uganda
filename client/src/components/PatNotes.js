import React, { Component } from 'react';
import calcToday from './calcToday'
import success from "../pictures/success.png"
import failed from "../pictures/failed.png"
import '../styles/main.css';
import '../styles/patient.css';
var dateFormat = require('dateformat')

class DateBlock extends Component {
	render() {
		var date;
		// if (this.props.text === this.props.today) {
		if (this.props.date === '18-05-28') {
			date = 'TODAY';
		} else {
			var dd = this.props.date.substr(6,2)
			var mm = this.props.date.substr(3,2)
			var yy = this.props.date.substr(0,2)
			var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			if (width < 700) {
				date = dd + '/' + mm;
			} else {
				date = dd + '/' + mm + '/' + yy;
			}
		}
		return(
			<div className="DateBlock">{date}</div>
		);		
	}
}

class GridSquare extends Component {
	render() {
		var tx, col;
		if (this.props.text === "Critical") {
			tx = "H"; col = '#FF1D00';
		} else if (this.props.text === "Urgent") {
			tx = "\u00b7\u00b7\u00b7"; col = '#FF1D00';
		} else if (this.props.text === "Urgent with fluid") {
			tx = "\u00b7\u00b7\u00b7"; col = '#FF1D00';
		} else if (this.props.text === "Fluid") {
			tx = "\u00b7\u00b7"; col = '#FFFE06';
		} else if (this.props.text === "Tired") {
			tx = "\u00b7\u00b7"; col = '#FFFE06';
		} else if (this.props.text === "Normal") {
			tx = "\u00b7"; col = '#91D150';
		}
		return(
			<div className='StatusBlock' title={this.props.text} style={{backgroundColor: col}}>{tx}</div>
		);
	}
}

class SuccessLogo extends Component {
	render() {
		if (this.props.saved) {
			return(
				<div className="Success">
					<img className="SuccessLogo" src={success} alt="" />
				</div>
			);
		} else if (this.props.failed) {
			return(
				<div className="Success">
					<img className="SuccessLogo" src={failed} alt="" />
				</div>
			);
		} else {
			return(
				<div></div>
			);
		}
		
	}
}

class NoteBlock extends Component {
	constructor(props) { 
		super(props)
		if (this.props.note !== "") {
			this.state = { 
				note: this.props.note
			}
		} else {
			this.state = { 
				note: ""
			}
		}
	}

	saveNote(note, phone, date) {
		var timestamp = dateFormat((new Date(), "isoDateTime"))
		var author = localStorage.getItem('username')

		var noteObj = {
			phone: phone,
			date: date,
			note: note,
			timestamp: timestamp,
			author: author,
			saved: false,
			failed: false
		};

		var payload = JSON.stringify(noteObj)
	    var token = localStorage.getItem('token');

	    var request = {
	      method: 'POST',
	      headers: {
	      	'Authorization': 'Bearer '+token,
	      	'Content-Type': 'application/json'
	      },
	      body: payload
	    }

	    fetch('/api/saveNote', request)
	    	.then(res => {
	    		if (res.status === 200) {
	    			this.setState({ 
	    				saved: true,
	    				failed: false
	    			})
	    		} else {
	    			this.setState({ 
	    				saved: false,
	    				failed: true
	    			})
	    		}
	    	})
	}

	render() {
		var date = this.props.date
		var phone = this.props.phone
		var id   = "notesOn"+date
		var noteStyle;

		if (this.state.saved) {
			noteStyle = "SavedNoteBlock"		
		} else if (this.state.failed) {
			noteStyle = "FailedNoteBlock"
		} else {
			noteStyle = "NoteBlock"
		}

		return(
			<div className={noteStyle} >
                <textarea
              	  placeholder="No notes recorded"
              	  value={this.state.note}
              	  id={id}
              	  onChange = { (e) => {
              	  	this.setState({ note: e.target.value })
              	  	this.saveNote(e.target.value,phone,date)
              	  }}
                >
            	</textarea>
        		<SuccessLogo saved={this.state.saved} failed={this.state.failed} />
			</div>
		);
	}
}

class GridRow extends Component {
	render() {
		var date = this.props.runs['date']
		var notes = this.props.notes
		var note;

		for (var idx=0; idx < notes.length; idx++) {
			if (notes[idx].date === date) {
				note = notes[idx].note
				break
			} else {
				note = ""
			}
		}

		return(
			<div className="GridRow">
				<DateBlock date={date} today={this.props.today} />
				<GridSquare key="status" text={this.props.runs['status']}/>
				<NoteBlock date={date} note={note} phone={this.props.phone}/>
			</div>
		);
	}
}

class PatNotes extends Component {
	constructor(props) { 
		super(props)
		this.state = { 
			notes: this.props.notes,
			saved: false,
			failed: false
		}
	}

	render() {
		var today = calcToday()
		var rows = [];
		for (var i=Object.keys(this.props.runs).length-1; i>-1; i--) {
			rows.push(
				<GridRow key={i} today={today} runs={this.props.runs[i]} notes={this.state.notes} phone={this.props.phone} />
			);
		}

		return (
			<div className="TableBlock">
				<h1>CLINICIAN NOTES</h1>
				<div className="Table"> {rows} </div>
			</div>
		);
	}
}

export default PatNotes;