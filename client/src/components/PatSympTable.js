import React, { Component } from 'react';
import calcToday from './calcToday'
import '../styles/main.css';
import '../styles/symptoms.css'

class HeadBlock extends Component {
	render() {
		if (this.props.text === this.props.today) {
			return(
				<div className={this.props.className}>TODAY</div>
			);
		} else {
			return(
				<div className={this.props.className}>{this.props.text}</div>
			);
		}
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
		var cl, tx;

		if (this.props.text === "Yes") { 
			cl = "SqYes"
			tx = ""
		} else if (this.props.text === "No") { 
			cl = "SqNo" 
			tx = ""
		} else if (this.props.text === "Critical") {
			cl = "SqCri"
			tx = "H"
		} else if (this.props.text === "Urgent") {
			cl = "SqUrg"
			tx = "\u00b7\u00b7\u00b7"
		} else if (this.props.text === "Urgent with fluid") {
			cl = "SqUWF"
			tx = "\u00b7\u00b7\u00b7"
		} else if (this.props.text === "Fluid") {
			cl = "SqFlu"
			tx = "\u00b7\u00b7"
		} else if (this.props.text === "Tired") {
			cl = "SqTir"
			tx = "\u00b7\u00b7"
		} else if (this.props.text === "Normal") {
			cl = "SqNor"
			tx = "\u00b7"
		} else {
			cl = "SqUnd"
			tx = ""
		}

		return(
			<div className={cl}>{tx}</div>
		);
	}
}

class GridColumn extends Component {
	render() {
		return(
			<main>
				<HeadBlock key="head" className="DateHead" text={this.props.values['date']} today={this.props.today} />
				<GridSquare key="fainted" text={this.props.values['fainted']}/>
				<GridSquare key="breath_seated" text={this.props.values['breath_seated']}/>
				<GridSquare key="chest_pain" text={this.props.values['chest_pain']}/>
				<GridSquare key="lightheaded" text={this.props.values['lightheaded']}/>
				<GridSquare key="swollen" text={this.props.values['swollen']}/>
				<GridSquare key="tired" text={this.props.values['tired']}/>
				<GridSquare key="breath_night" text={this.props.values['breath_night']}/>
				<GridSquare key="heart_beat" text={this.props.values['heart_beat']}/>
				<GridSquare key="status" text={this.props.values['status']}/>
			</main>
		);
	}
}

class PatSympTable extends Component {
	render() {
		if (typeof(this.props.values[0]) !== 'undefined') {
			var today = calcToday();

			var columns = [];
			for (var i=Object.keys(this.props.values).length-1; i>-1; i--) {
				columns.push(
					<GridColumn key={i} values={this.props.values[i]} today={today} />
				);
			}

			return (
				<div className="TableBlock">
					<h1>SYMPTOMS</h1>
					<div className="Table" style={{display: "flex"}}>
						<TitleColumn />
						<div className="TableSymp">{columns}</div>
					</div>
				</div>
				);
		} else {
			return(
				<div className='Middle'> </div>
			)
		}
	}
}

export default PatSympTable;