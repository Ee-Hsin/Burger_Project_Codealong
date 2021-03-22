import React from 'react'

import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {

    const ingredientSummary = props.ingredients;
    const ingredientsList = [];

    for (let key in ingredientSummary){
        ingredientsList.push(
            <li key={key}>
            <span style={{textTransform: 'capitalize'}}>{key}</span> 
            {" " + ingredientSummary[key]} 
            </li>);
    }

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientsList}
            </ul>
            <p><strong>Total Price: {props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout?</p>

            <Button btnType="Danger" clicked={props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>CHECKOUT</Button>

        </Aux>
    )
}

export default orderSummary;