import React, { Component } from 'react';
import { BounceLoader } from 'react-spinners';

class Loader extends Component {
	render() {
		return(
			<div className='Loading'> 
				<BounceLoader
		          color={'#484848'} 
		          loading={true} 
		        />
			</div>
		)
	}
}

export default Loader;