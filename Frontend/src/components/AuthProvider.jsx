import { useReducer } from "react";
import userReducer from "../Reducers/userReducer";
import userContext from "../Context/userContext";
import { LOGIN, SERVER_ERROR, SET_NGO_PROFILE, LOGOUT } from "./actions";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { SET_NGO_STEP1 } from "./actions";
//------------------------------------------------------------------------------------------------------------------------
const initialState = {
  isLoggedIn: false,
  user: null,
  serverErr: null,
  ngoProfile: null,
  ngoStep1: null,
  isLoading: true,
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

      try {
        const ngoResponse = await axios.get("/api/ngo/profile", {
          headers: { Authorization: localStorage.getItem("token") },
        });

        const ngoProfile = ngoResponse.data;
        console.log("NGO PROFILE:", ngoProfile);

        const docsUploaded =
          ngoProfile.coordinatorAadhaarUrl && ngoProfile.ngoLicenseUrl
            ? true
            : false;

        dispatch({ type: SET_NGO_PROFILE, payload: ngoProfile });
        dispatch({ type: SERVER_ERROR, payload: "" });
        resetForm();

        if (!docsUploaded) {
          navigate("/uploadDoc");
          return;
        }

        if (ngoProfile.status === "Pending") {
          navigate("/ngo/status");
          return;
        }

        if (ngoProfile.status === "Verified") {
          navigate("/ngoprofile");
          return;
        }

        if (ngoProfile.status === "Rejected") {
          const rejectionReason =
            ngoProfile.reason || "Your NGO registration was rejected";
          dispatch({
            type: SERVER_ERROR,
            payload: `Rejected: ${rejectionReason}`,
          });
          navigate("/ngo/status");
          return;
        }
      } catch (ngoErr) {
        try {
          const userResponse = await axios.get("/api/profile", {
            headers: { Authorization: localStorage.getItem("token") },
          });

          console.log("USER PROFILE:", userResponse.data);

          dispatch({ type: LOGIN, payload: userResponse.data });
          dispatch({ type: SERVER_ERROR, payload: "" });

          resetForm();

          if (userResponse.data.role === "Admin") {
            navigate("/admin");
            return;
          }

          navigate("/tasks");
        } catch (profileErr) {
          localStorage.removeItem("token");
          dispatch({
            type: SERVER_ERROR,
            payload:
              profileErr?.response?.data?.error ||
              "Unable to fetch user profile",
          });
        }
      }
    } catch (err) {
      localStorage.removeItem("token");
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
  //---------------------------------------------------------------------------------------------------------------------
  const handleRegisterNgoStep1 = (formData) => {
    dispatch({ type: SET_NGO_STEP1, payload: formData });
    navigate("/registerNgostep2");
  };
  //---------------------------------------------------------------------------------------------------------------------
  const handleRegisterStep2 = async (formData, resetForm) => {
    try {
      if (!state.ngoStep1) {
        dispatch({ type: SERVER_ERROR, payload: "Please fill step 1 details" });
        return;
      }
      const combinedData = { ...state.ngoStep1, ...formData };
      const response = await axios.post("/api/ngo/register", combinedData);
      console.log(response.data);
      dispatch({ type: SET_NGO_STEP1, payload: null });
      dispatch({ type: SERVER_ERROR, payload: "" });
      resetForm();
      navigate("/login");
    } catch (err) {
      console.log(err);
      dispatch({
        type: SERVER_ERROR,
        payload:
          err?.response?.data?.error ||
          err?.message ||
          "NGO Registration Failed",
      });
    }
  };
  //------------------------------------------------------------------------------------------------------------------------
  const clearServerError=()=>{
    dispatch({type:SERVER_ERROR,payload:""})
  }
  //------------------------------------------------------------------------------------------------------------------------
  return (
    <userContext.Provider
      value={{
        ...state,
        handleUserRegister,
        handleLogin,
        handleLogout,
        handleRegisterNgoStep1,
        handleRegisterStep2,
        clearServerError
      }}
    >
      {props.children}
    </userContext.Provider>
  );
}
