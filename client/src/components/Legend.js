import React, { Component } from 'react'
import GridSquare from './GridSquare'

class Legend extends Component {
	render() {
		return(
		<div className="TableBlock">
			<h1>LEGEND</h1>
			<div className="Legend" style={{paddingBottom: '20px'}}>
				<div className="LegendSquare" style={{marginLeft: '12.5%'}}>
					<GridSquare class='LegendBlock' text='Yes'/>
					<font>Yes</font>
				</div>
				<div className="LegendSquare">
					<GridSquare class='LegendBlock' text='No'/>
					<font>No</font>
				</div>
				<div className="LegendSquare">
					<GridSquare class='LegendBlock' text=''/>
					<font>No response</font>
				</div>
			</div>
			<div className="Legend">
				<div className="LegendSquare">
					<GridSquare class='LegendBlock' text='Normal'/>
					<font>Low risk</font>
				</div>
				<div className="LegendSquare">
					<GridSquare class='LegendBlock' text='Fluid'/>
					<font>Moderate risk</font>
				</div>
				<div className="LegendSquare">
					<GridSquare class='LegendBlock' text='Urgent'/>
					<font>High risk</font>
				</div>
				<div className="LegendSquare">
					<GridSquare class='LegendBlock' text='Critical'/>
					<font>Critical</font>
				</div>
			</div>
		</div>
		);
	}
}

export default Legend;