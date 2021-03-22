import React from 'react';

//We need to import the image instead of linking it in the source 
//because when in production, the file structure of src will be changed by webpack.
//So if we link the image, it won't work. But if we import, webpack knows we rely on that image.

import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.css';

const logo = (props) => {
    return(
        <div className={classes.Logo}>
            <img src={burgerLogo} alt="MyBurger" />
        </div>
    )
}

export default logo;