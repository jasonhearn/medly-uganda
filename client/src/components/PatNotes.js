import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import PatHead from './PatHead'
import PatSympTable from './PatSympTable'
import Logos from './Logos'
import calcToday from './calcToday'
import '../styles/main.css';
import '../styles/patient.css'

class DateBlock extends Component {
	render() {
		if (this.props.text === this.props.today) {
			var text = 'TODAY';
		} else {
			var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			if (width < 700) {
				var text = this.props.text.substr(3);
			} else {
				var text = this.props.text
			}
		}
		return(
			<div className="DateBlock">{text}</div>
		);		
	}
}

class NoteBlock extends Component {
	render() {
		return(
			<div className="NoteBlock">
                <textarea
              	  placeholder="No notes recorded"
                >
            	</textarea>
			</div>
		);
	}
}

class GridRow extends Component {
	render() {
		return(
			<div className="GridRow">
				<DateBlock text={this.props.values['date']} today={this.props.today} />
				<NoteBlock />
			</div>
		);
	}
}

class PatNotes extends Component {
	render() {
		if (typeof(this.props.values[0]) !== 'undefined') {
			var today = calcToday()
			var rows = [];
			for (var i=Object.keys(this.props.values).length-1; i>-1; i--) {
				rows.push(
					<GridRow key={i} values={this.props.values[i]} today={today} />
				);
			}

			return (
				<div className="TableBlock">
					<h1>CLINICIAN NOTES</h1>
					<div className="Table">
						{rows}
					</div>
					<Button className="SaveNotesButton" type="submit">
		              Save Notes
		            </Button>
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