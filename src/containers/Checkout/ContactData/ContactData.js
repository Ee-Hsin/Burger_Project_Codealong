import React, { Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state= {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name' //UI
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 2
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
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
                value: 'fastest',
                validation: {},
                valid: true, 
            }
        },
        formIsValid: false 
    }
    orderHandler = (event) => {
        event.preventDefault();

        const formData= {};

        for (let formElementIdentifier in this.state.orderForm){
            //This creates SOMETHING LIKE THIS:
            //formData[name] = "Sarah"
            //formData[email] = "sarah@gmail.com"
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order={
            ingredients: this.props.ings,
            price: this.props.price, //on real app, would take ingredients and recalculate price on the server itself.
            orderData: formData
        }
        this.props.onOrderBurger(order, this.props.token);
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (!rules){ //Means no rules
            return true;
        }
        if (rules.required) {
            isValid = (value.trim() !== '') && isValid;//isValid will be true as long as value isn't empty or whitespace
        }

        if (rules.minLength){
            isValid = (value.length >= rules.minLength) && isValid;
        }

        if (rules.maxLength) {
            isValid = (value.length <= rules.maxLength) && isValid;
        }

        //Should have added these 2 rules earlier, but just decided to add this now (I also added the rule in the config above).
        if (rules.isEmail) {
            const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric){
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }   

    inputChangedHandler = (event, inputIdentifier) => {

        const updatedOrderForm = {
            ...this.state.orderForm //spreading jus tthe orderForm dooes not create "deep clone", which we need now.
        }
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier] //create a copy of a copy so it is cloned deeply
        }

        //Change the value in the copy of the copy
        updatedFormElement.value = event.target.value;
        //Updates the valid variable with the result of checkValidity
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched= true; 
        //Change the value of the copy with the copy of the copy
        updatedOrderForm[inputIdentifier] = updatedFormElement; 

        //Gonna check if all inputs are valid:
        let formIsValid = true; 
        for (let inputId in updatedOrderForm){
            formIsValid = updatedOrderForm[inputId].valid && formIsValid;
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid}) //Set state with the copy and the overall form validity.
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
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}/>)
                })}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );

        if (this.props.loading) {
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));