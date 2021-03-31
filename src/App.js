import React, { Component } from 'react';
import {Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

class App extends Component {

  componentDidMount () {
    this.props.onCheckAuthState();
  }

  render() {
    return (
      <div>
        <Layout>
          <Switch>
            {this.props.isAuthenticated ? <Route path = "/checkout" component={Checkout}/> : null}
            {this.props.isAuthenticated ? <Route path = "/orders" exact component={Orders}/> : null}
            <Route path = "/" exact component={BurgerBuilder}/>
            <Route path = "/auth" component = {Auth} />
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