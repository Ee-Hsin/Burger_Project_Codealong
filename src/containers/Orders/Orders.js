import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';

import Order from '../../components/Order/Order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    
    state = {
        orders: [], //<-- Let's manage this via redux (but only once we know how to handle async in Redux)
        loading: true //<-- UI
    }

    componentDidMount() {
        this.props.onLoadOrders(this.props.token)
    }


    render(){
        let orders = <Spinner />;
        if (!this.props.loading) {
            orders = this.props.orders.map(order => {
                return (
                    <Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        price={+order.price}/>
                    )
                })
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLoadOrders: (token) => dispatch(actions.fetchOrders(token)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));