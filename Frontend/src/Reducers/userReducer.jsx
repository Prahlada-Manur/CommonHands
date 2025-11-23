import {
  SERVER_ERROR,
  SET_NGO_PROFILE,
  LOGIN,
  LOGOUT,
  SET_NGO_STEP1
} from "../components/actions";
const userReducer = (state, action) => {
  switch (action.type) {
    case SERVER_ERROR: {
      return { ...state, serverErr: action.payload };
    }
    case LOGIN: {
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
        serverErr: "",
        isLoading: false,
      };
    }
    case LOGOUT: {
      return { ...state, isLoggedIn: false, user: null, ngoProfile: null };
    }
    case SET_NGO_PROFILE: {
      return { ...state, ngoProfile: action.payload, isLoading: false};
    }
    case SET_NGO_STEP1: {
      return { ...state, ngoStep1: action.payload };
    }
    default: {
      return { ...state };
    }
  }
};
export default userReducer;
