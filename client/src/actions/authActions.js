import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
// decodes bearer token string
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

//Register
// history parameter is a redirect from the Register.js
export const registerUser = (userData, history) => dispatch => {
  // axios makes the call to the api/back-end.  don't need localhost: 5000 because we made a proxy in json.
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    // thunk is used here.  Dispatch action type. In object
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      //save to local storage
      const { token } = res.data;
      //set token to local storage. Local storage only stores strings.
      localStorage.setItem('jwtToken', token);
      //set to auth header
      //token has all user information.
      setAuthToken(token);
      //Decode token for user data
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set current user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log user out
export const logoutUser = () => dispatch => {
  //remove item from local storage
  localStorage.removeItem('jwtToken');
  //remove auth header for future requests
  setAuthToken(false);
  //set current user to empty object which will set isAutheniticated to false
  dispatch(setCurrentUser({}));
};
