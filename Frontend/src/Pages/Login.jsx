import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import userContext from "../Context/userContext";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import logo from "../assets/ngo2.jpg"

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
    <div className="p-15 bg-red-100 flex justify-center items-center px-6 py-10">
      <div className="bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden flex w-full max-w-5xl">
        <div className="hidden md:block w-1/2 bg-red-200">
          <img
            src={logo} 
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* RIGHT SIDE LOGIN CARD */}
        <div className="w-full md:w-1/2 p-10 flex justify-center items-center">
          <Card className="w-full shadow-none border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Welcome Back!
              </CardTitle>
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
                {/* EMAIL */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    placeholder="xyz@example.com"
                    className="border-red-300 focus-visible:ring-red-500"
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="text-red-600 text-xs">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="Enter your password"
                    className="border-red-300 focus-visible:ring-red-500"
                  />
                  {formik.errors.password && formik.touched.password && (
                    <p className="text-red-600 text-xs">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* LOGIN BUTTON */}
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-red-600 transition text-white font-semibold rounded-lg py-5"
                >
                  Login
                </Button>

                {/* LINKS */}
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
      </div>
    </div>
  );
}
