import React from 'react';
import { Switch, Route } from "react-router-dom"
import Login from './Login'
import PatSearch from './PatSearch'
import CreatePat from './CreatePat'
import CreateClin from './CreateClin'
import PatBrowse from './PatBrowse'
import Patient from './Patient'
import requireAuth from './requireAuth'

const App = () => (
  <main>
    <Switch>
      	<Route exact path='/' component={Login} />
		<Route path='/main/search' component={requireAuth(PatSearch)} />
		<Route path='/main/adduser' component={requireAuth(CreateClin)} />
		<Route path='/main/addpatient' component={requireAuth(CreatePat)} />
		<Route path='/main/browse' component={requireAuth(PatBrowse)} />
		<Route path='/main/patient/:phone' component={requireAuth(Patient)} />
    </Switch>
  </main>
)

export default App;