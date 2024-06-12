const MyUserReducer = (currentState, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      return null;
    case "updateFirstLogin":
      return { ...currentState, first_login: false };
  }
  return currentState;
};
export default MyUserReducer;
