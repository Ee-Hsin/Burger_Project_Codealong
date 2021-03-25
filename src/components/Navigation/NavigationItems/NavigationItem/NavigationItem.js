import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.css'

const navigationItem = (props) => {
    return(
        <li className={classes.NavigationItem}>  
               
            <NavLink 
            to={props.link} 
            exact={props.exact} 
            /*Can't use default active naming behaviour because we are using CSS modules, so have to add the CSS active*/
            activeClassName={classes.active}
            >{props.children}</NavLink>
        </li>
    )
}

export default navigationItem;