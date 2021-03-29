import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component {

    state = {
        purchasable : false, //UI
        purchasing: false, //UI
        loading: false, //UI
        error: false  //UI
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
                return true;
            }
        }
        return false;

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
        
        this.props.history.push({
            pathname: "/checkout",
        });
    }

    render() {

        //Before we return, we determine which buttons to disable.
        const disabledInfo = {...this.props.ings};

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0; /*returns true (meaing we want to disable the button, 
            if the key is below or equal to 0)*/
        }

        //Start orderSummary properly
        let orderSummary = <OrderSummary 
            ingredients={this.props.ings}
            price={this.props.price} 
            purchaseCancelled={this.purchaseCancelHandler} 
            purchaseContinued={this.purchaseContinueHandler} 
            />;

        //Start with the Burger and the Controls properly
        let burger= <Aux>
            <Burger ingredients = {this.props.ings}/>
            <BuildControls
            price={this.props.price}
            ingredientRemoved={this.props.onIngredientRemoved}
            ingredientAdded={this.props.onIngredientAdded}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler} />
            </Aux>;

        //If no ingredients (AKA hasn't been loaded in from backend yet)
        //Then put a spinner/message on Burger and set orderSummary to null
        if (!this.props.ings) {
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName))
    }
}   

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));