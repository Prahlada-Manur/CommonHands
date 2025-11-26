import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import userContext from "../Context/userContext";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const { handleLogin, serverErr, clearServerError } = useContext(userContext);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      handleLogin(values, resetForm);
    },
  });

  useEffect(() => {
    clearServerError();
  }, []);

  return (
    <div className="p-20 px-4 bg-red-100 flex justify-center items-start ">
      <Card className="w-full max-w-md shadow-xl rounded-xl border border-red-200 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Login to continue your journey.
          </CardDescription>
        </CardHeader>

        {serverErr && (
          <p className="text-red-600 text-center text-sm mb-2 font-medium">
            {serverErr}
          </p>
        )}

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="xyz@example.com"
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-600 text-xs">{formik.errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Enter your password"
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-600 text-xs">{formik.errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-red-500 transition text-white font-semibold rounded-lg py-5"
            >
              Login
            </Button>

            <div className="text-center mt-2 space-y-1">
              <p className="text-sm">
                New to the platform?{" "}
                <Link
                  to="/register"
                  className="text-red-700 font-medium hover:underline"
                >
                  Register
                </Link>
              </p>

              <p className="text-sm">
                Want to register your NGO?{" "}
                <Link
                  to="/registerNgo"
                  className="text-red-700 font-medium hover:underline"
                >
                  Click here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
