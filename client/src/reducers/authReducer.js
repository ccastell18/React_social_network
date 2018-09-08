const initialState = {
  isAuthenticated: false,
  user: {}
};
//exports a state and an action
export default function(state = initialState, action) {
  //switch must contain a type. switch tests cases
  //don't mutate the state.  Use spread operator.
  switch (action.type) {
    default:
      return state;
  }
}
