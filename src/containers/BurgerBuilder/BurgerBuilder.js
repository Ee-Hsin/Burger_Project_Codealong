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
        ingredients: null,
        totalPrice: 5,
        purchasable : false,
        purchasing: false,
        loading: false,
        error: false
    }

    //fetch starting ingredients:
    componentDidMount () {
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error:true})
            });
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
        
        const queryParams = [];
        for (let ingredient in this.state.ingredients){
            queryParams.push(encodeURIComponent(ingredient) + '=' + encodeURIComponent(this.state.ingredients[ingredient]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&')
        this.props.history.push({
            pathname: "/checkout",
            search: '?' + queryString
        });
    }

    render() {

        //Before we return, we determine which buttons to disable.
        const disabledInfo = {...this.state.ingredients};

        for (let key in disabledInfo){
            disabledInfo[key] = this.state.ingredients[key] <= 0; /*returns true (meaing we want to disable the button, 
            if the key is below or equal to 0)*/
        }

        //Start orderSummary properly
        let orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice} 
            purchaseCancelled={this.purchaseCancelHandler} 
            purchaseContinued={this.purchaseContinueHandler} 
            />;

        //Start with the Burger and the Controls properly
        let burger= <Aux>
            <Burger ingredients = {this.state.ingredients}/>
            <BuildControls
            price={this.state.totalPrice}
            ingredientRemoved={this.removeIngredientHandler}
            ingredientAdded={this.addIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler} />
            </Aux>;

        //If no ingredients (AKA hasn't been loaded in from backend yet)
        //Then put a spinner/message on Burger and set orderSummary to null
        if (!this.state.ingredients) {
            //Prints a pargraph if there is an error, and a spinner (cuz it's loading), if there isn't one.
            burger= this.state.error? <p>Ingredients can't be loaded</p> : <Spinner/>
            orderSummary = null;
        }
        
        if(this.state.loading) {
            orderSummary = <Spinner/>
        }

        return(
        <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);