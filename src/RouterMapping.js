import { React } from 'react'
import { 
	BrowserRouter as Router,
  	Route,
  	Link
} from 'react-router-dom';

import Login from './components/Login';
import PatSearch from './components/PatSearch';

const RouterMapping = () => (
	<Router>
		<div>
			<Route path='/' component={Login} />
			<Route path='/' component={PatSearch} />
		</div>
	</Router>
);

export default RouterMapping;