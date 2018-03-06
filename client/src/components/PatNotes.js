import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import calcToday from './calcToday'
import success from "../pictures/success.png"
import '../styles/main.css';
import '../styles/patient.css'

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

class NoteBlock extends Component {
	constructor(props) { 
		super(props)
		this.state = { 
			note: this.props.note
		}
	}

	render() {
		var date = this.props.date
		var id   = "notesOn"+date
		return(
			<div className="NoteBlock">
                <textarea
              	  placeholder="No notes recorded"
              	  value={this.state.note}
              	  id={id}
              	  onChange = { (e) => {
              	  	this.setState({note: e.target.value})
              	  }}
                >
            	</textarea>
			</div>
		);
	}
}

class GridRow extends Component {
	render() {
		var date = this.props.values['date']
		var note = this.props.notes[date]
		return(
			<div className="GridRow">
				<DateBlock date={date} today={this.props.today} />
				<NoteBlock date={date} note={note}/>
			</div>
		);
	}
}

class PatNotes extends Component {
	constructor(props) { 
		super(props)
		this.state = { 
			notes: {},
			saved: false
		}
	}

	componentDidMount() {
		var phone = this.props.phone.substr(1);
	    var token = localStorage.getItem('token');

	    var url = '/getNotes?phone=' + phone
	    var request = {
	      headers: {
	      	'Authorization': 'Bearer ' + token,
	      },
	    }

	    fetch(url, request)
	    	.then(res => res.json())
			.then(data => this.setState({ notes : data }))
	}

	saveNotes() {
		var dates = [];
		var vals = this.props.values
		var noteObj = {
			phone: this.props.phone.substr(1),
			notes: {}
		};
		for (var i=Object.keys(this.props.values).length-1; i>-1; i--) {
			dates.push(vals[i]['date'])
		} 

		for (var j=0; j<dates.length; j++) {
			var elem = document.getElementById('notesOn'+dates[j])
			noteObj['notes'][dates[j]] = elem.value
		}

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

	    fetch('/saveNotes', request)
	    	.then(res => {
	    		if (res.status === 200) {
	    			this.setState({ saved: true })
	    		}
	    	})
	}

	render() {
		if (!!this.props.values[0] && Object.keys(this.state.notes).length !== 0) {
			var today = calcToday()
			var rows = [];
			for (var i=Object.keys(this.props.values).length-1; i>-1; i--) {
				rows.push(
					<GridRow key={i} today={today} values={this.props.values[i]} notes={this.state.notes} />
				);
			}

			return (
				<div className="TableBlock" style={{paddingBottom: '3%'}}>
					<h1>CLINICIAN NOTES</h1>
					<div className="Table">
						{rows}
					</div>
					<Button className="SaveNotesButton" type="submit" onClick = {() => this.saveNotes() }>
		              Save Notes
		            </Button>
		            <SavedMessage saved={this.state.saved}/>
				</div>
				);
		} else {
			return(
				<div className='Middle'> </div>
			)
		}
	}
}

export default PatNotes;