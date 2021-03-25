import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import ContactData from './ContactData/ContactData';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {

    constructor(props){
        super(props);
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = 10;

        for (let param of query.entries()) {
            if (param[0] === "price"){
                price = +param[1];
            } else {
                ingredients[param[0]] = +param[1]; //the "+" converts it to a number.
            }
        }

        this.state = {
            ingredients: ingredients,
            price: price
        };
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render () {
        return (
            <div>
                <CheckoutSummary 
                ingredients={this.state.ingredients}
                checkoutCancelled={this.checkoutCancelledHandler}
                checkoutContinued={this.checkoutContinuedHandler}
                />
                <Route path={this.props.match.path + '/contact-data'} render={(props) => <ContactData ingredients={this.state.ingredients} price= {this.state.totalPrice} {...props}/>}/>
            </div>
        )
    }
}

export default Checkout;