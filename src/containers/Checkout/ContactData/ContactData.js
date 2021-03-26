import React, { Component } from 'react';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state= {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E Mail'
                },
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'},
                    ],
                    placeholder: 'Delivery Method'
                },
                value: ''
            }
        },
        loading: false      
    }
    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});

        const formData= {};

        for (let formElementIdentifier in this.state.orderForm){
            //This creates:
            //formData[name] = "Sarah"
            //formData[email] = "sarah@gmail.com"
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order={
            ingredients: this.props.ingredients,
            price: this.props.price, //on real app, would take ingredients and recalculate price on the server itself.
            orderData: formData
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

    inputChangedHandler = (event, inputIdentifier) => {
        console.log(event.target.value)

        const updatedOrderForm = {
            ...this.state.orderForm //spreading jus tthe orderForm dooes not create "deep clone", which we need now.
        }
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier] //create a copy of a copy so it is cloned deeply
        }

        updatedFormElement.value = event.target.value;//Change the value in the copy of the copy
        updatedOrderForm[inputIdentifier] = updatedFormElement; //Change the value of the copy with the copy of the copy

        this.setState({orderForm: updatedOrderForm}) //Set state with the copy.
    }

    render() {

        //turn state.orderForm into array we can loop through

        const formElementsArray = [];
        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => {
                    return (<Input key={formElement.id} 
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value={formElement.config.value}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}/>)
                })}
                <Button btnType="Success">ORDER</Button>
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