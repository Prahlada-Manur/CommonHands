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
    .matches(/[A-Z]/, "Must contain one uppercase letter")
    .matches(/[0-9]/, "Must contain one number")
    .matches(/[!@#$%^&*.]/, "Must contain one special character"),
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
    onSubmit: (values) => handleRegisterNgoStep1(values),
  });

  useEffect(() => clearServerError(), []);

  return (
    <div className="p-15 px-4 bg-red-100 flex justify-center items-start ">
      <Card className="w-full max-w-lg shadow-md rounded-xl border border-red-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-center font-bold">
            Register Your Organization
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm text-center">
            Step 1: Create admin login account
          </CardDescription>
        </CardHeader>

        {serverErr && (
          <p className="text-red-600 text-center text-sm mb-2 font-medium">
            {serverErr}
          </p>
        )}

        <CardContent className="pt-0">
          <form onSubmit={formik.handleSubmit} className="space-y-3">
            {/* FIRST + LAST NAME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  placeholder="First Name"
                />
                {formik.errors.firstName && formik.touched.firstName && (
                  <p className="text-red-600 text-xs">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  placeholder="Last Name"
                />
                {formik.errors.lastName && formik.touched.lastName && (
                  <p className="text-red-600 text-xs">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* EMAIL + MOBILE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
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

            {/* PASSWORD */}
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Password"
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-600 text-xs">{formik.errors.password}</p>
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-red-500 text-white rounded-lg py-3"
            >
              Next
            </Button>
          </form>

          {/* LOGIN LINK */}
          <div className="text-center mt-3">
            <p className="text-sm">
              Already a user?{" "}
              <Link to="/login" className="text-red-700 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
