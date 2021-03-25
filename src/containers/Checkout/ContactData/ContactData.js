import React, { Component } from 'react';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';


class ContactData extends Component {
    state= {
        name: '',
        email: '',
        address : {
            street: '',
            postalCode: ''
        },
        loading: false
        
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});

        const order={
            ingredients: this.props.ingredients,
            price: this.props.price, //on real app, would take ingredients and recalculate price on the server itself.

            //Hard coding info for now (in future will implement checkout page requiring info)
            customer: {
                name: 'Ee Hsin Kok',
                address: {
                    street: 'Teststreet 1',
                    zipCode: '41351',
                    country: 'Germany'
                },
                email: "test@test.com"
            },
            deliveryMethod: 'fastest'
        }
        //The .json format is exclusive to Firebase to tell it to store it in .json.
        //Anyway, the /orders endpoint will let firebase create a node for orders.
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
                console.log(response);
            })
            .catch(error => {
                this.setState({loading: false});
                console.log(error);
            });
    }

    render() {

        let form = (
            <form >
                <input className={classes.Input} type="text" name="name" placeholder="Your name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your Email" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        ) 
    }

}


export default ContactData;