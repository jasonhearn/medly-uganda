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
		        .then(res => res.json())
		        .then(status => {
		        	localStorage.setItem('status', status)
		        	localStorage.setItem('proceed', 'ok')
		        })
		    }
		}

	    render() {
	    	var token = localStorage.getItem('token')
	    	var status = localStorage.getItem('status')
	    	var proceed = localStorage.getItem('proceed')

	    	if (typeof(proceed) !== "undefined") {
		        return status === "ok" && token !== 'undefined'
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