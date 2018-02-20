import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom"
import PatHead from './PatHead'
import '../styles/main.css';

class HeadBlock extends Component {
	render() {
		return(
			<div className={this.props.className}>{this.props.text}</div>
		);
	}
}

class TitleBlock extends Component {
	render() {
		return(
			<div className='TitleBlock'>{this.props.title}</div>
		);
	}
}

class TitleColumn extends Component {
	render() {
		return(
			<div>
				<HeadBlock className="SympBlock" text="SYMPTOMS" />
				<TitleBlock title="Fainted" />
				<TitleBlock title="Shortness of breath (seated)" />
				<TitleBlock title="Chest pain" />
				<TitleBlock title="Lightheaded" />
				<TitleBlock title="Swollen ankles" />
				<TitleBlock title="Tired" />
				<TitleBlock title="Shortness of breath (night)" />
				<TitleBlock title="Unusual heartbeat" />
				<TitleBlock title="STATUS" /> 
			</div>
		);
	}
}

class GridSquare extends Component {
	render() {
		if (this.props.text === "Yes") { 
			var cl = "SqYes"
			var tx = ""
		} else if (this.props.text === "No") { 
			var cl = "SqNo" 
			var tx = ""
		} else if (this.props.text === "Critical") {
			var cl = "SqCri"
			var tx = "H"
		} else if (this.props.text === "Urgent") {
			var cl = "SqUrg"
			var tx = "\u00b7\u00b7\u00b7"
		} else if (this.props.text === "Urgent with fluid") {
			var cl = "SqUWF"
			var tx = "\u00b7\u00b7\u00b7"
		} else if (this.props.text === "Fluid") {
			var cl = "SqFlu"
			var tx = "\u00b7\u00b7"
		} else if (this.props.text === "Tired") {
			var cl = "SqTir"
			var tx = "\u00b7\u00b7"
		} else if (this.props.text === "Normal") {
			var cl = "SqNor"
			var tx = "\u00b7"
		} else {
			var cl = "SqUnd"
			var tx = ""
		}

		return(
			<div className={cl}>{tx}</div>
		);
	}
}

class GridColumn extends Component {
	render() {
		return(
			<div>
				<HeadBlock className="DateBlock" text={this.props.values['date']} />
				<GridSquare text={this.props.values['fainted']}/>
				<GridSquare text={this.props.values['breath_seated']}/>
				<GridSquare text={this.props.values['chest_pain']}/>
				<GridSquare text={this.props.values['lightheaded']}/>
				<GridSquare text={this.props.values['swollen']}/>
				<GridSquare text={this.props.values['tired']}/>
				<GridSquare text={this.props.values['breath_night']}/>
				<GridSquare text={this.props.values['heart_beat']}/>
				<GridSquare text={this.props.values['status']}/>
			</div>
		);
	}
}

class PatBody extends Component {
	render() {
		if (typeof(this.props.values[0]) != 'undefined') {
			var columns = [];
			for (var i=Object.keys(this.props.values).length-1; i>-1; i--) {
				columns.push(
					<div>
						<GridColumn values={this.props.values[i]} />
					</div>
				);
			}

			return (
				<div className="TableBlock">
					<h1>SYMPTOMS</h1>
					<div className="Table">
						<TitleColumn />
						<div className="TableSymp">{columns}</div>
					</div>
				</div>
				);
			} else {
				return(
					<div className='Middle'> Loading... </div>
				)
			}
		}
	}


class Patient extends Component {
	constructor(props) { 
		super(props)
		this.state = { 
			data : {},
			values: {} 
		}
	}

	componentDidMount() {
		var url = '/runs';

		fetch(url)
			.then(res => res.json())
			.then(data => this.setState({ data : data }))
	}

	componentDidUpdate(prevProps,prevState) {
		if (prevState.data !== this.state.data) {
			var tmp_val = {}
			for (var i = 0; i < Object.keys(this.state.data).length; i++) {
				var tmp_dict = this.state.data[i].results[0].values
				var var_keys = Object.keys(tmp_dict)
				tmp_val[i] = {}
				tmp_val[i]['date'] = this.state.data[i].results[0].exited_on.substr(2,8)
				for (var j = 0; j < var_keys.length; j++) {
					tmp_val[i][var_keys[j]] = tmp_dict[var_keys[j]]['category']
				}
			}
			this.setState({values : tmp_val})
		}
	}

	render() {
		return (
			<div className="MiddleTop">
				<PatHead />
				<PatBody values={this.state.values}/>
			</div>
			);
	}
}

export default Patient;