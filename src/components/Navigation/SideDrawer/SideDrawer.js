import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const sideDrawer = (props) => {
    
    let attachedClasses = [classes.SideDrawer, classes.Close];

    if(props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return(
        <Aux>
            <Backdrop show={props.open} clicked={props.closed}/>
            <div className={attachedClasses.join(' ')} onClick={props.closed}>{/* Add props.closed to OnClick, which is an 
            event handler passed in by the layout parent component. This is so that when the user clicks the sidedrawer, it closes. 
            We want the sidedrawer to close onClick so that when links are clicked to change the page, the sidedrawer retracts.*/}
                <div className={classes.Logo}>
                    <Logo />    
                </div>
                <nav>
                    <NavigationItems isAuthenticated={props.isAuth}/>
                </nav>
            </div>
        </Aux>
    );
}

export default sideDrawer;