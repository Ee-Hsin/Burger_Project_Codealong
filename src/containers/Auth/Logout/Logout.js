import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

class Logout extends Component {

    componentDidMount() {
        this.props.onLogout();//Logs out the User
    }

    render() {
        return (
            <Redirect to="/"/> //Instantly redirects the user
        );
    }
}

const mapDispatchToprops = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    }
}

export default connect(null,mapDispatchToprops)(Logout);