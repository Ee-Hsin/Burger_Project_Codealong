import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './BurgerIngredient.css';

//We decided to make it class based so that we could use prop types (but it's not actually necessary)
class BurgerIngredient extends Component {
    render(){
        let ingredient = null;

        switch (this.props.type) {
            case('bread-bottom'):
                ingredient = <div className={classes.BreadBottom}></div>;
                break;
            case('bread-top'):
                ingredient = (
                    <div className={classes.BreadTop}>
                        <div className={classes.Seeds1}></div>
                        <div className={classes.Seeds2}></div>
                    </div>
                )
                break;
            case ('meat'):
                ingredient = <div className={classes.Meat}></div>
                break;
            case ('cheese'):
                ingredient = <div className={classes.Cheese}></div>
                break;
            case ('salad'):
                ingredient = <div className={classes.Salad}></div>
                break;
            case ('bacon'):
                ingredient = <div className={classes.Bacon}></div>
                break;
            default:
                ingredient = null;
        }
        return ingredient;
    }
}

//prop types to restrict the "type" that gets passed into BurgerIngredient as a string and as required.
BurgerIngredient.propTypes = {
    type: PropTypes.string.isRequired
}

export default BurgerIngredient;