import userContext from "../Context/userContext";
import { useContext, useEffect } from "react";
import { useFormik } from "formik";
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
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().required().email(),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*.]/,
      "Password must contain at least one special character"
    ),
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .min(10, "Mobile number must be at least 10 digits"),
});

export default function RegisterNgo() {
  const { serverErr, handleRegisterNgoStep1, clearServerError } =
    useContext(userContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
    },
    validationSchema: validation,
    onSubmit: (values) => {
      handleRegisterNgoStep1(values);
    },
  });
  useEffect(() => {
    clearServerError();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-yellow-50">
      <Card className="w-full max-w-lg shadow-lg border border-black p-4 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Register Your Organization
          </CardTitle>
          <CardDescription className="text-center">
            Step 1: Create admin login account
          </CardDescription>
        </CardHeader>

        {serverErr && (
          <p className="text-red-600 text-center text-sm mb-3">{serverErr}</p>
        )}

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  placeholder="Enter First Name"
                />
              </div>

              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  placeholder="Enter Last Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  placeholder="xyz@example.com"
                />
              </div>

              <div className="space-y-1">
                <Label>Mobile Number</Label>
                <Input
                  type="text"
                  name="mobileNumber"
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  placeholder="1234567890"
                />
                {formik.errors.mobileNumber && formik.touched.mobileNumber && (
                  <p className="text-red-600 text-xs">
                    {formik.errors.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="***********"
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-600 text-xs">{formik.errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-yellow-700 text-white"
            >
              Next
            </Button>
          </form>
          <div className="text-center mt-2">
            <p className="text-sm">
              Already a User?
              <Link
                to="/login"
                className="text-yellow-700 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
