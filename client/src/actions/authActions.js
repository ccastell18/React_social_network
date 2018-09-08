import axios from 'axios';
import { GET_ERRORS } from './types';

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
