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
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().required().email(),
  password: Yup.string()
    .required(
      "Password must contain One UpperCase, one number, and one special character"
    )
    .min(8, "Password Must be 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*.]/,
      "Password must contain at least one special character"
    ),
  mobileNumber: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
});

export default function Register() {
  const { handleUserRegister, serverErr, clearServerError } =
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
    onSubmit: (values, { resetForm }) => {
      handleUserRegister(values, resetForm);
    },
  });

  useEffect(() => {
    clearServerError();
  }, []);

  return (
    <div className="p-15 px-4 bg-red-100 flex justify-center items-start py-10">
      <Card className="w-full max-w-lg shadow-xl rounded-xl border border-red-200 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Register with Us</CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Join us in making a difference.
          </CardDescription>
        </CardHeader>

        {serverErr && (
          <p className="text-red-600 text-center text-sm mb-3 font-medium">
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
                  value={formik.values.firstName}
                  name="firstName"
                  onChange={formik.handleChange}
                  placeholder="Enter First Name"
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
                  value={formik.values.lastName}
                  name="lastName"
                  onChange={formik.handleChange}
                  placeholder="Enter Last Name"
                />
                {formik.errors.lastName && formik.touched.lastName && (
                  <p className="text-red-600 text-xs">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* EMAIL + PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formik.values.email}
                  name="email"
                  onChange={formik.handleChange}
                  placeholder="xyz@example.com"
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="text-red-600 text-xs">{formik.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  value={formik.values.mobileNumber}
                  name="mobileNumber"
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

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={formik.values.password}
                name="password"
                onChange={formik.handleChange}
                placeholder="Enter Password"
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-600 text-xs">{formik.errors.password}</p>
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-red-500 transition text-white font-semibold rounded-lg py-5"
            >
              Register
            </Button>

            <div className="text-center mt-2 space-y-1">
              <p className="text-sm">
                Already a user?{" "}
                <Link
                  to="/login"
                  className="text-red-700 font-medium hover:underline"
                >
                  Login
                </Link>
              </p>

              <p className="text-sm">
                Want to register your organization?{" "}
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
