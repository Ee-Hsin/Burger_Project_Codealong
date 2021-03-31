import React from 'react';

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl'
//import custom elements to be used in render. (Apply this to the notes for the rest)

const controls = [
    {label: 'Salad', type: 'salad'},
    {label: 'Bacon', type: 'bacon'},
    {label: 'Cheese', type: 'cheese'},
    {label: 'Meat', type: 'meat'},
]

const buildControls = (props) => {
    return (
        <div className = {classes.BuildControls}>
            <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
            {controls.map((control) => {
                return (
                <BuildControl 
                added={() => props.ingredientAdded(control.type)} 
                removed={() => props.ingredientRemoved(control.type)} 
                key={control.label} label={control.label}
                disabled={props.disabled[control.type]}
                />
                )
            })}
            <button 
                onClick={props.ordered} 
                className={classes.OrderButton} 
                disabled={!props.purchasable}>{props.isAuth ? 'ORDER NOW' : 'SIGN UP TO ORDER'}</button>
        </div>
    )
}

export default buildControls;