import React from 'react';
import { Switch, Link, Route, Router, Redirect } from "react-router-dom"
import Login from './Login'
import PatSearch from './PatSearch'
import PatBrowse from './PatBrowse'
import Patient from './Patient'
import requireAuth from './requireAuth'

const App = () => (
  <main>
    <Switch>
      	<Route exact path='/' component={Login} />
		<Route path='/patsearch' component={requireAuth(PatSearch)} />
		<Route path='/patbrowse' component={requireAuth(PatBrowse)} />
		<Route path='/patient/:phone' component={requireAuth(Patient)} />
    </Switch>
  </main>
)

export default App;