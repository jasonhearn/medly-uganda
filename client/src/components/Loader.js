import React, { Component } from 'react';
import { RingLoader } from 'react-spinners';

class Loader extends Component {
	render() {
		return(
			<div className='Loading'> 
				<RingLoader
		          color={'#484848'} 
		          loading={true} 
		        />
			</div>
		)
	}
}

export default Loader;