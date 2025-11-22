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
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      handleLogin(values, resetForm);
    },
  });

  useEffect(() => {
    clearServerError();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-yellow-50">
      <Card className="w-full max-w-md shadow-lg border border-black p-4 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-center">
            Login to continue your journey.
          </CardDescription>
        </CardHeader>

        {serverErr && (
          <p className="text-red-600 text-center text-sm mb-2">{serverErr}</p>
        )}

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="xyz@example.com"
              />
              {formik.errors.email &&
                formik.touched.email(
                  <p className="text-red-600 text-xs">{formik.errors.email}</p>
                )}
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="*************"
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-600 text-xs">{formik.errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-yellow-700 text-white"
            >
              Login
            </Button>

            <div className="text-center space-y-1 mt-1">
              <p className="text-sm">
                New to the platform?
                <Link
                  to="/register"
                  className="text-yellow-700 font-medium hover:underline"
                >
                  Register
                </Link>
              </p>

              <p className="text-sm">
                Want to register your NGO?
                <Link
                  to="/registerNgo"
                  className="text-yellow-700 font-medium hover:underline"
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
