import React from 'react';
import { withRouter, Redirect } from 'react-router';

export default function requireAuth(Component) {

  class AuthenticatedComponent extends React.Component {
    render() {
      return this.props.isLoggedIn
        ? <Component { ...this.props } />
        : <Redirect to="/" />;
    }

  }

  return withRouter(AuthenticatedComponent);
}