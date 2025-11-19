import { useReducer } from "react";
import userReducer from "../Reducers/userReducer";
import userContext from "../Context/userContext";
import { LOGIN, SERVER_ERROR, SET_NGO_PROFILE,LOGOUT } from "./actions";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
//------------------------------------------------------------------------------------------------------------------------
const initialState = {
  isLoggedIn: false,
  user: null,
  serverErr: null,
  ngoProfile: null
};
//--------------------------------------------------------------------------------------------------------------------------

export default function AuthProvider(props) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const navigate = useNavigate();
  //-------------------------------------------------------------------------------------------------------------------------
  const handleUserRegister = async (formData, resetForm) => {
    try {
      const response = await axios.post("/api/register", formData);
      resetForm();
      dispatch({ type: SERVER_ERROR, payload: "" });
      navigate("/login");
    } catch (err) {
      console.log(err);
      const payload =
        err?.response?.data?.error || err?.message || "Registration Failed";
      dispatch({ type: SERVER_ERROR, payload });
    }
  };
//-----------------------------------------------------------------------------------------------------------------------------
  const handleLogin = async (formData, resetForm) => {
    try {
      const response = await axios.post("/api/login", formData);
      localStorage.setItem("token", response.data.token);
      const userResponse = await axios.get("/api/profile", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(userResponse?.data);
      dispatch({ type: LOGIN, payload: userResponse.data });
      dispatch({ type: SERVER_ERROR, payload: "" });
      if (userResponse.data.role === "NGO") {
        try {
          const ngoResponse = await axios.get("/api/ngo/profile", {
            headers: { Authorization: localStorage.getItem("token") },
          });
          dispatch({ type: SET_NGO_PROFILE, payload: ngoResponse.data });
        } catch (err) {
          console.log(err.message);
        }
        navigate("/uploadDoc");
      } else if (userResponse.data.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
      resetForm();
    } catch (err) {
      console.log(err);
      dispatch({
        type: SERVER_ERROR,
        payload: err?.response?.data?.error || err?.message || "Login failed",
      });
    }
  };
  //--------------------------------------------------------------------------------------------------------------------
   const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: LOGOUT });
    navigate("/login");
  };
  //------------------------------------------------------------------------------------------------------------------------
  return (
    <userContext.Provider value={{ ...state, handleUserRegister, handleLogin,handleLogout }}>
      {props.children}
    </userContext.Provider>
  );
}
