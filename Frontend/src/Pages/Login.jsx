import { useFormik } from "formik";
import { useContext } from "react";
import userContext from "../Context/userContext";
import * as Yup from "yup";
import { Link } from "react-router-dom";
//-----------------------------------------------------------------------------------------------
const validation = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});
//----------------------------------------------------------------------------------------------------
export default function Login() {
  const { handleLogin, serverErr } = useContext(userContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      handleLogin(values, resetForm);
    },
  });
  //-------------------------------------------------------------------------------------------------------------
  return (
    <div>
      <h1>Login Here</h1>
      {serverErr && <p>{serverErr}</p>}
      <form onSubmit={formik.handleSubmit}>
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
          <label>Enter password</label>
          <input
            type="password"
            value={formik.values.password}
            name="password"
            onChange={formik.handleChange}
            placeholder="***********"
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        <p>
          New to platform?
          <Link to="/register">register</Link>
        </p>
      </form>
    </div>
  );
}
