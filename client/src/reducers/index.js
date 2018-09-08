import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';

//put all reducers within curly braces
export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});
