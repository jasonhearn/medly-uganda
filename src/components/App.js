import React from 'react';
import { Switch, Link, Route, Router } from "react-router-dom"
import Login from './Login'
import PatSearch from './PatSearch'
import Patient from './Patient'

const App = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Login} />
      <Route path='/patsearch' component={PatSearch} />
      <Route path='/patient' component={Patient} />
    </Switch>
  </main>
)

export default App;