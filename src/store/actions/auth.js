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