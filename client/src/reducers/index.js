import { combineReducers } from 'redux';
import authReducer from './authReducer';

//put all reducers within curly braces
export default combineReducers({
  auth: authReducer
});
