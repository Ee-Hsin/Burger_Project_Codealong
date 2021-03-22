import React from 'react'

import Aux from '../../../hoc/Auxiliary';

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
            <p>Continue to Checkout?</p>
        </Aux>
    )
}

export default orderSummary;