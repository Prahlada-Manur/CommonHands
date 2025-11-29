import userContext from "../Context/userContext";
import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import ngo from "../assets/regngo.png"

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
    <div className="p-8 bg-red-100 flex justify-center items-center ">
      {/* WRAPPER */}
      <div className="bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden flex w-full max-w-5xl">
        {/* LEFT SIDE — FORM CARD */}
        <div className="w-full md:w-1/2 p-10 flex justify-center items-center">
          <Card className="w-full shadow-none border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Register Your Organization
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Step 1: Create your admin login credentials
              </CardDescription>
            </CardHeader>

            {serverErr && (
              <p className="text-red-600 text-center text-sm mb-2 font-medium">
                {serverErr}
              </p>
            )}

            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* NAME ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      placeholder="First Name"
                      className="border-red-300 focus-visible:ring-red-500"
                    />
                    {formik.errors.firstName && formik.touched.firstName && (
                      <p className="text-red-600 text-xs">
                        {formik.errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      placeholder="Last Name"
                      className="border-red-300 focus-visible:ring-red-500"
                    />
                    {formik.errors.lastName && formik.touched.lastName && (
                      <p className="text-red-600 text-xs">
                        {formik.errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* EMAIL + MOBILE ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                      type="text"
                      name="mobileNumber"
                      value={formik.values.mobileNumber}
                      onChange={formik.handleChange}
                      placeholder="1234567890"
                      className="border-red-300 focus-visible:ring-red-500"
                    />
                    {formik.errors.mobileNumber &&
                      formik.touched.mobileNumber && (
                        <p className="text-red-600 text-xs">
                          {formik.errors.mobileNumber}
                        </p>
                      )}
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="Password"
                    className="border-red-300 focus-visible:ring-red-500"
                  />
                  {formik.errors.password && formik.touched.password && (
                    <p className="text-red-600 text-xs">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* NEXT BUTTON */}
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-red-600 text-white rounded-lg py-4 transition"
                >
                  Next
                </Button>

                {/* LOGIN LINK */}
                <div className="text-center mt-2">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-red-700 hover:underline">
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE — IMAGE */}
        <div className="hidden md:block w-1/2 bg-red-200">
          <img
            src={ngo} // Replace with your image
            alt="NGO Register Visual"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
