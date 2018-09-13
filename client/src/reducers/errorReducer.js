import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {};
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      // payload will have errors object from server. (authActions.js)
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}
