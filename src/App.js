import React, { Component } from 'react';
import {Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout')
});
const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders')
});
const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth')
});


class App extends Component {

  componentDidMount () {
    this.props.onCheckAuthState();
  }

  render() {
    return (
      <div>
        <Layout>
          <Switch>
            {this.props.isAuthenticated ? <Route path = "/checkout" component={asyncCheckout}/> : null}
            {this.props.isAuthenticated ? <Route path = "/orders" exact component={asyncOrders}/> : null}
            <Route path = "/" exact component={BurgerBuilder}/>
            <Route path = "/auth" component = {asyncAuth} />
            <Route path = "/logout" component = {Logout} /> 
            <Redirect to="/"/>
          </Switch>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated : state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCheckAuthState: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App); 