import React from 'react';
import { Switch, Link, Route, Router } from "react-router-dom"
import Login from './Login'
import PatSearch from './PatSearch'

const App = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Login} />
      <Route path='/patsearch' component={PatSearch} />
    </Switch>
  </main>
)

export default App;