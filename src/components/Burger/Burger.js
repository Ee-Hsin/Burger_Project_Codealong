import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

    /*NOTE: He does a different thing in his videos which are unnecessarily complicated imo, I simplified it with a double for loop
    which does the same thing.*/

    //An array that will contain the BurgerIngredient elements
    let ingredientElements = []  

    //Filling up the array by going through the object's keys and subsequent value pairs, then creating a unique key for them too.
    for (let key in props.ingredients){
        for (let i = 0; i < props.ingredients[key]; i++){
            ingredientElements.push(<BurgerIngredient key={key + i} type={key}/>);
        }  
    }    
    
    if (ingredientElements.length === 0){
        ingredientElements = <p>Please start adding Ingredients!</p>
    }

    return(
        <div className={classes.Burger}>
            <BurgerIngredient type = "bread-top"/>
            {ingredientElements}
            <BurgerIngredient type = "bread-bottom"/>
        </div>
    );
};

export default burger;