import { useFormik } from "formik";
import { useContext } from "react";
import userContext from "../Context/userContext";
import * as Yup from "yup";
import { Link } from "react-router-dom";
//--------------------------------------------------------------------------------------------------------------
const validation = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().required().email(),
  password: Yup.string()
    .required("Password must contain One UpperCase and one Special character")
    .min(8, "Password Must be 8 character"),
  mobileNumber: Yup.string().required().min(10),
});
//---------------------------------------------------------------------------------------------------------------
export default function Register() {
  const { handleUserRegister, serverErr } = useContext(userContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
    },
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      handleUserRegister(values, resetForm);
    },
  });
  //-------------------------------------------------------------------------------------------------------------------------
  return (
    <div>
      <h1>Register with Us!!!</h1>
      {serverErr && <p>{serverErr}</p>}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Enter First Name</label>
          <input
            type="text"
            value={formik.values.firstName}
            name="firstName"
            onChange={formik.handleChange}
            placeholder="Enter First Name"
          />
        </div>
        <div>
          <label>Enter Last Name</label>
          <input
            type="text"
            value={formik.values.lastName}
            name="lastName"
            onChange={formik.handleChange}
            placeholder="Enter Last Name"
          />
        </div>
        <div>
          <label>Enter Email</label>
          <input
            type="email"
            value={formik.values.email}
            name="email"
            onChange={formik.handleChange}
            placeholder="xyz@example.com"
          />
        </div>
        <div>
          <label>Enter Phone Number</label>
          <input
            type="text"
            value={formik.values.mobileNumber}
            name="mobileNumber"
            onChange={formik.handleChange}
            placeholder="1234567890"
          />
        </div>
        <div>
          <label>Enter Password</label>
          <input
            type="password"
            value={formik.values.password}
            name="password"
            onChange={formik.handleChange}
            placeholder="Enter Password"
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
         <p>
          Already a user?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
