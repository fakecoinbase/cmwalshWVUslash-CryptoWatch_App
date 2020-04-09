const isEmpty = require("is-empty");

const initialState = {
    user: null,
    holdingsHistory: []
};

export default function firebaseReducer(state = initialState, action: any) {
  switch (action.type) {
    case "SET_USER_STATE": 
        return {...state, user: action.payload}
    case "SET_HOLDINGS_HISTORY": 
        return {...state, holdingsHistory: action.payload}
    case "SET_CURRENT_USER":
        return {
            ...state,
            isAuthenticated: !isEmpty(action.payload),
            user: action.payload
          };
    default:
      return state;
  }
}
