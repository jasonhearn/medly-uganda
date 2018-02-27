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
			return(
				<div className="DateBlock">TODAY</div>
			);
		} else {
			return(
				<div className="DateBlock">{this.props.text}</div>
			);
		}		
	}
}

class NoteBlock extends Component {
	render() {
		return(
			<div className="NoteBlock">
				<form>
		            <FormGroup className="NotesForm">
		              <textarea 
		              	className="form-control" 
		              	placeholder="No notes recorded"
		              >
		              </textarea>
		            </FormGroup>
          		</form>
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