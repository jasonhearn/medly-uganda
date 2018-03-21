import React, { Component } from 'react';
import calcToday from './calcToday'
import success from "../pictures/success.png"
import '../styles/main.css';
import '../styles/patient.css';
var dateFormat = require('dateformat')

class SavedMessage extends Component {
  render() {
    if (this.props.saved) {
      return(
        <div className='Success'>
          <img 
            src={success} 
            className='ErrorIcon' 
            alt="" 
          />
          All notes saved to database
        </div>
      );
    } else {
      return(
        <div> </div>
    )}
  }
}

class DateBlock extends Component {
	render() {
		var date;
		// if (this.props.text === this.props.today) {
		if (this.props.date === '18-02-14') {
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

class NoteBlock extends Component {
	constructor(props) { 
		super(props)
		if (!!this.props.note) {
			this.state = { 
				note: this.props.note.note
			}
		} else {
			this.state = { 
				note: ""
			}
		}
	}

	saveNote(note, uuid, date) {
		var timestamp = dateFormat((new Date(), "isoDateTime"))
		var author = localStorage.getItem('username')

		var noteObj = {
			uuid: uuid,
			date: date,
			note: note,
			timestamp: timestamp,
			author: author
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

	    fetch('/saveNote', request)
	    	.then(res => {
	    		if (res.status === 200) {
	    			this.setState({ saved: true })
	    		}
	    	})
	}

	render() {
		var date = this.props.date
		var uuid = this.props.uuid
		console.log(uuid)
		var id   = "notesOn"+date
		return(
			<div className="NoteBlock">
                <textarea
              	  placeholder="No notes recorded"
              	  value={this.state.note}
              	  id={id}
              	  onChange = { (e) => {
              	  	this.setState({note: e.target.value})
              	  	this.saveNote(e.target.value,uuid,date)
              	  }}
                >
            	</textarea>
			</div>
		);
	}
}

class GridRow extends Component {
	render() {
		var date = this.props.runs['date']
		var note = this.props.notes[date]
		return(
			<div className="GridRow">
				<DateBlock date={date} today={this.props.today} />
				<GridSquare key="status" text={this.props.runs['status']}/>
				<NoteBlock date={date} note={note} uuid={this.props.uuid}/>
			</div>
		);
	}
}

class PatNotes extends Component {
	constructor(props) { 
		super(props)
		this.state = { 
			notes: this.props.notes,
			saved: false
		}
	}

	render() {
		var today = calcToday()
		var rows = [];
		for (var i=Object.keys(this.props.runs).length-1; i>-1; i--) {
			rows.push(
				<GridRow key={i} today={today} runs={this.props.runs[i]} notes={this.state.notes} uuid={this.props.uuid} />
			);
		}

		return (
			<div className="TableBlock">
				<h1>CLINICIAN NOTES</h1>
				<div className="Table"> {rows} </div>
	            <SavedMessage saved={this.state.saved}/>
			</div>
		);
	}
}

export default PatNotes;