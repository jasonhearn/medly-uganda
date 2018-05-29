import React, { Component } from 'react';
import calcToday from './calcToday'
import GridSquare from './GridSquare'
import '../styles/main.css';
import '../styles/symptoms.css'

class HeadBlock extends Component {
	render() {
		var text;
		console.log(this.props.text)
		if (this.props.className === "SympBlock") {
			text = this.props.text;
		} else {
			// if (this.props.text === this.props.today) {
			if (this.props.text === '18-05-28') {
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

		console.log(text)

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

class GridColumn extends Component {
	render() {
		return(
			<main>
				<HeadBlock  key="head" className="DateHead" text={this.props.runs['date']} today={this.props.today} />
				<GridSquare class='ResponseBlock' key="fainted" text={this.props.runs['fainted']}/>
				<GridSquare class='ResponseBlock' key="breath_seated" text={this.props.runs['breath_seated']}/>
				<GridSquare class='ResponseBlock' key="chest_pain" text={this.props.runs['chest_pain']}/>
				<GridSquare class='ResponseBlock' key="lightheaded" text={this.props.runs['lightheaded']}/>
				<GridSquare class='ResponseBlock' key="swollen" text={this.props.runs['swollen']}/>
				<GridSquare class='ResponseBlock' key="tired" text={this.props.runs['tired']}/>
				<GridSquare class='ResponseBlock' key="breath_night" text={this.props.runs['breath_night']}/>
				<GridSquare class='ResponseBlock' key="heart_beat" text={this.props.runs['heart_beat']}/>
				<GridSquare class='ResponseBlock' key="status" text={this.props.runs['status']}/>
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
				<main>
					<div className="TableBlock">
						<h1>SYMPTOMS</h1>
						<div className="Table" style={{display: "flex"}}>
							<TitleColumn />
							<div className="TableSymp">{columns}</div>
						</div>
					</div>
				</main>
				);
		} else {
			return(
				<div className='Middle'> </div>
			)
		}
	}
}

export default PatSympTable;