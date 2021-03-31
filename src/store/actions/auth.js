import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

//Logout action creator:
export const logout = () => {
    //We remove the token, expiration time and userId when we log out.
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT //dispatches the logout action
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() =>{
            dispatch(logout()) //Calls logout function after expiration time passes.
        }, expirationTime * 1000)
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAzaGNQhMzVxVaB3aJPRDaPjPouhD7OStk';
        if (!isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAzaGNQhMzVxVaB3aJPRDaPjPouhD7OStk';
        }

        axios.post(url,authData)
            .then(response => {
                console.log(response);

                //We are going to store our token and its expiration date in Local Storage:
                //We first calculate the expiration Date based on the current time.
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000) 
                //We store the expiration Date 
                localStorage.setItem('expirationDate', expirationDate);  
                //Then we store the token.
                localStorage.setItem('token', response.data.idToken); 
                //Then we store the userId.
                localStorage.setItem('userId', response.data.localId);

                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn)); //we pass it a string with the time until the token expires.
            })
            .catch(err => {
                //The way Axios works, it wraps the response, so we have to .response to activate it.
                dispatch(authFail(err.response.data.error.message));
            })
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

//We will run this everytime we refresh the page, that way we can quickly check if the user is authenticated or not.
export const authCheckState = () => {
    //won't run async code, but want to dispatch multiple actions, so use this format.
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            //If token is null, don't need to do anything. User was not logged in.
        } else {
            //We retrieve the date from the localStorage and convert it into a date object.
            const expirationDate = new Date(localStorage.getItem('expirationDate'));

            if (new Date() < expirationDate){
                const userId = localStorage.getItem('userId') //We get the userId from local Storage as well
                dispatch(authSuccess(token, userId)) 
                //We set it to expire in the time from the expiration to now.
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000))
            } else {
                dispatch(logout())
            }
        }
    }
}