import React from 'react';

import classes from './Order.css';

const order = (props) => {

    //An array that will contain the BurgerIngredient elements
    const ingredientOutput =[];

    //Filling up the array by going through the object's keys and subsequent value pairs, then creating a unique key for them too.
    for (let ingredientName in props.ingredients){
        ingredientOutput.push(<span key={ingredientName} 
            style={{
            textTransform: 'capitalize',
            display: "inline-block",
            margin: '0 8px',
            border: '1px solid grey',
            padding: '5px'
        }}>
        {ingredientName} ({props.ingredients[ingredientName]})
        </span>)
    }    

    return(
        <div className={classes.Order}>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>USD {props.price.toFixed(2)}</strong></p>
        </div>
    )
}

export default order;