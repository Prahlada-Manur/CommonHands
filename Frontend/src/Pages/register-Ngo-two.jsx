import { useContext, useEffect } from "react";
import userContext from "../Context/userContext";
import * as Yup from "yup";
import { useFormik } from "formik";
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

//----------------------------------------------------------- VALIDATION -------------------------------------------------------
const validation = Yup.object().shape({
  ngoName: Yup.string().required("Organization name is required"),
  contactEmail: Yup.string()
    .required("Email is required")
    .email("Invalid email"),
  regNumber: Yup.string().required("Registration / Darpan number is required"),
});

//----------------------------------------------------------- COMPONENT --------------------------------------------------------
export default function RegisterNgoTwo() {
  const { serverErr, handleRegisterStep2, clearServerError } =
    useContext(userContext);

  const formik = useFormik({
    initialValues: {
      ngoName: "",
      contactEmail: "",
      regNumber: "",
    },
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      handleRegisterStep2(values, resetForm);
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
            Organization Details
          </CardTitle>
          <CardDescription className="text-center">
            Step 2: Complete organization profile
          </CardDescription>
        </CardHeader>

        {serverErr && (
          <p className="text-red-600 text-center text-sm mb-3">{serverErr}</p>
        )}

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Organization Name */}
            <div className="space-y-1">
              <Label>Organization Name</Label>
              <Input
                type="text"
                name="ngoName"
                value={formik.values.ngoName}
                onChange={formik.handleChange}
                placeholder="Enter Organization Name"
              />
            </div>

            {/* Darpan / Registration Number */}
            <div className="space-y-1">
              <Label>Darpan / Registration Number</Label>
              <Input
                type="text"
                name="regNumber"
                value={formik.values.regNumber}
                onChange={formik.handleChange}
                placeholder="AB/134/56789"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-1">
              <Label>Contact Email</Label>
              <Input
                type="email"
                name="contactEmail"
                value={formik.values.contactEmail}
                onChange={formik.handleChange}
                placeholder="xyz@example.com"
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-yellow-700 text-white"
            >
              Submit & Login
            </Button>
          </form>
          <div className="text-center mt-2">
            <p className="text-sm">
              <Link
                to="/registerNgo"
                className="text-yellow-700 font-medium hover:underline"
              >
                ← Go back to Step 1
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
