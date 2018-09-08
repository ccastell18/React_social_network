import { GET_ERRORS } from '../actions/types';

const initialState = {};
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      // payload will have errors object from server. (authActions.js)
      return action.payload;
    default:
      return state;
  }
}
