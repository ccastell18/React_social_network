import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];
//parameter one is rootReducer(index.js), parameter two is the initial state, parameter three applies a spread of all middleware added to middleware variable.
//original store = createStore(()=>{}, {}, appyMiddleware())
const store = createStore(
  rootReducer,
  initialState,
  //compose connects to Redux State inspector on Chrome
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
