const initialState = {
  isAuthenticated: false,
  user: {}
};
//exports a state and an action
export default function(state = initialState, action) {
  //switch must contain a type. switch tests cases
  switch (action.type) {
    default:
      return state;
  }
}
