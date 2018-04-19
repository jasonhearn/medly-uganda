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
		<Route path='/patientsearch' component={requireAuth(PatSearch)} />
		<Route path='/createclinician' component={requireAuth(CreateClin)} />
		<Route path='/createpatient' component={requireAuth(CreatePat)} />
		<Route path='/patientbrowse' component={requireAuth(PatBrowse)} />
		<Route path='/patient/:phone' component={requireAuth(Patient)} />
    </Switch>
  </main>
)

export default App;