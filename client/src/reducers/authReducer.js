import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from '../validations/is-empty';

const initialState = {
  isAuthenticated: false,
  user: {}
};
//exports a state and an action
export default function(state = initialState, action) {
  //switch must contain a type. switch tests cases
  //don't mutate the state.  Use spread operator.
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
