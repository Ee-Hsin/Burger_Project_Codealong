import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon : 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 5,
        purchasable : false,
        purchasing: false,
        loading: false
    }

    //purchase state will be false unless there are any ingredients in ingredients above 0.
    updatePurchaseState= (ingredients) => {
        for (let key in ingredients){
            if (ingredients[key] !== 0){
                this.setState({purchasable: true})
                return;
            }
        }
        this.setState({purchasable: false})

    }

    addIngredientHandler = (type) => {
        const updatedCount = this.state.ingredients[type] +1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        console.log("a"); //delete later
        const newPrice = this.state.totalPrice +  INGREDIENT_PRICES[type]; 

        this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {

        /*Only runs if there's ingredients to remove (so price won't be decreased unecesseraily and
        updatedCount of ingredients wpm't gp negative)*/
        if(this.state.ingredients[type] > 0){
            let updatedCount = this.state.ingredients[type] -1;
            const updatedIngredients = {...this.state.ingredients};
            updatedIngredients[type] = updatedCount;
            console.log("d"); //delete later
    
    
            const newPrice = this.state.totalPrice -  INGREDIENT_PRICES[type]; 
    
            this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
            this.updatePurchaseState(updatedIngredients);
        }
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler= () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You Continue!');
        //Implementing checkout
        this.setState({loading: true});

        const order={
            ingredients: this.state.ingredients,
            price: this.state.totalPrice, //on real app, would take ingredients and recalculate price on the server itself.

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
                this.setState({loading: false, purchasing: false});
                console.log(response);
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});
                console.log(error);
            });
    }

    render() {

        //Before we return, we determine which buttons to disable.
        const disabledInfo = {...this.state.ingredients};

        for (let key in disabledInfo){
            disabledInfo[key] = this.state.ingredients[key] <= 0; /*returns true (meaing we want to disable the button, 
            if the key is below or equal to 0)*/
        }

        let orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice} 
            purchaseCancelled={this.purchaseCancelHandler} 
            purchaseContinued={this.purchaseContinueHandler} 
            />;

        if(this.state.loading) {
            orderSummary = <Spinner/>
        }

        return(
        <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            <Burger ingredients = {this.state.ingredients}/>
            <BuildControls
                price={this.state.totalPrice}
                ingredientRemoved={this.removeIngredientHandler}
                ingredientAdded={this.addIngredientHandler}
                disabled={disabledInfo}
                purchasable={this.state.purchasable}
                ordered={this.purchaseHandler}
            />
        </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);