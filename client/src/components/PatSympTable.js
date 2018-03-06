import React, { Component } from 'react';
import calcToday from './calcToday'
import '../styles/main.css';
import '../styles/symptoms.css'

class HeadBlock extends Component {
	render() {
		var text;
		if (this.props.className === "SympBlock") {
			text = this.props.text;
		} else {
			// if (this.props.text === this.props.today) {
			if (this.props.text === '18-02-14') {
				text = 'TODAY';
			} else {
				var dd = this.props.text.substr(6,2)
				var mm = this.props.text.substr(3,2)
				var yy = this.props.text.substr(0,2)
				var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
				if (width < 700) {
					text = dd + '/' + mm;
				} else {
					text = dd + '/' + mm + '/' + yy;
				}
			}
		}

		return(
			<div className={this.props.className}>{text}</div>
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
			<div className={cl} title={this.props.text}>{tx}</div>
		);
	}
}

class GridColumn extends Component {
	render() {
		return(
			<main>
				<HeadBlock key="head" className="DateHead" text={this.props.runs['date']} today={this.props.today} />
				<GridSquare key="fainted" text={this.props.runs['fainted']}/>
				<GridSquare key="breath_seated" text={this.props.runs['breath_seated']}/>
				<GridSquare key="chest_pain" text={this.props.runs['chest_pain']}/>
				<GridSquare key="lightheaded" text={this.props.runs['lightheaded']}/>
				<GridSquare key="swollen" text={this.props.runs['swollen']}/>
				<GridSquare key="tired" text={this.props.runs['tired']}/>
				<GridSquare key="breath_night" text={this.props.runs['breath_night']}/>
				<GridSquare key="heart_beat" text={this.props.runs['heart_beat']}/>
				<GridSquare key="status" text={this.props.runs['status']}/>
			</main>
		);
	}
}

class PatSympTable extends Component {
	render() {
		if (!!this.props.runs[0]) {
			var today = calcToday();

			var columns = [];
			for (var i=Object.keys(this.props.runs).length-1; i>-1; i--) {
				columns.push(
					<GridColumn key={i} runs={this.props.runs[i]} today={today} />
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