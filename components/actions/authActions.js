
export const loginUser = (dispatch, user) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };
  
  export const logoutUser = (dispatch) => {
    dispatch({ type: 'LOGOUT' });
  };
  