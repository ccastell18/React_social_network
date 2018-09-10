import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';

//put all reducers within curly braces
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer
});
