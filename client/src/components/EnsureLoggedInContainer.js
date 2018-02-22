import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Switch, Link, Route, Router, Redirect } from "react-router-dom"
import { setRedirectUrl, browserHistory, navigateTo } from '../../../actions/url';

class EnsureLoggedInContainer extends Component {
	constructor(props, context) {
    super(props, context);

    this.state = {
      isLoggedIn: true
    };
  }

  componentDidMount() {
		const { dispatch, currentURL } = this.props
    if (!this.state.isLoggedIn) {
      dispatch(setRedirectUrl(currentURL))
      browserHistory.replace("/")
    }
	}

	render() {
    if (this.state.isLoggedIn) {
      return this.props.children
    } else {
      return null
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isLoggedIn: state.loggedIn,
    currentURL: ownProps.location.pathname
  }
}

export default connect(mapStateToProps)(EnsureLoggedInContainer);