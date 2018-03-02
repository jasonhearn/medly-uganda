import React from 'react';
import { withRouter, Redirect } from 'react-router';

export default function requireAuth(Component) {

  	class AuthenticatedComponent extends Component {
		constructor(props, context) {
		    super(props, context);

		    this.state = { 
		      status: ''
		    }
		}

	  	componentDidMount() {
  			var token = localStorage.getItem('token');

		    var request = {
				method: 'GET',
				headers: {
					'Authorization': 'Bearer '+token
				},
		    }

		    if (token !== 'undefined' && token !== null) {
		    	fetch('/secret', request)
			        .then(res => this.setState({status: res.status}))
		    }
		}

	    render() {
	    	if (!!this.state.status || 
	    		!localStorage.getItem('token') ||
	    		localStorage.getItem('token') === 'undefined') {
		        return this.state.status === 200
			        ? <Component { ...this.props } />
			        : <Redirect to="/" />;
			} else {
		    	return (
					<div className='Middle'> </div>
				)}
			}

		}

  return withRouter(AuthenticatedComponent);
}