import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

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
        purchasing: false
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
        //will implement a checkout in the future
        alert('You Continue!');
    }

    render() {

        //Before we return, we determine which buttons to disable.
        const disabledInfo = {...this.state.ingredients};

        for (let key in disabledInfo){
            disabledInfo[key] = this.state.ingredients[key] <= 0; /*returns true (meaing we want to disable the button, 
            if the key is below or equal to 0)*/
        }

        return(
        <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                <OrderSummary price={this.state.totalPrice} purchaseCancelled={this.purchaseCancelHandler} purchaseContinued={this.purchaseContinueHandler} ingredients={this.state.ingredients}/>
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

export default BurgerBuilder;