const MyUserReducer = (currentState, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      return null;
    case "updateAvatar":
      return {
        ...state,
        avatar: action.payload.avatar,
      };
  }
  return currentState;
};
export default MyUserReducer;
