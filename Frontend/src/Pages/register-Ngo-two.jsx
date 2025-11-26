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

const validation = Yup.object().shape({
  ngoName: Yup.string().required("Organization name is required"),
  contactEmail: Yup.string()
    .required("Email is required")
    .email("Invalid email"),
  regNumber: Yup.string().required("Registration / Darpan number is required"),
});

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

  useEffect(() => clearServerError(), []);

  return (
    <div className="p-10 px-4 bg-red-100 flex justify-center items-start py-10">
      <Card className="w-full max-w-lg shadow-md rounded-xl border border-red-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-center font-bold">
            Organization Details
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm text-center">
            Step 2: Complete organization profile
          </CardDescription>
        </CardHeader>

        {serverErr && (
          <p className="text-red-600 text-center text-sm mb-2 font-medium">
            {serverErr}
          </p>
        )}

        <CardContent className="pt-0">
          <form onSubmit={formik.handleSubmit} className="space-y-3">
            {/* ORGANIZATION NAME */}
            <div className="space-y-1">
              <Label>Organization Name</Label>
              <Input
                type="text"
                name="ngoName"
                value={formik.values.ngoName}
                onChange={formik.handleChange}
                placeholder="Organization Name"
              />
              {formik.errors.ngoName && formik.touched.ngoName && (
                <p className="text-red-600 text-xs">{formik.errors.ngoName}</p>
              )}
            </div>

            {/* REG NUMBER */}
            <div className="space-y-1">
              <Label>Darpan / Registration Number</Label>
              <Input
                type="text"
                name="regNumber"
                value={formik.values.regNumber}
                onChange={formik.handleChange}
                placeholder="AB/123/56789"
              />
              {formik.errors.regNumber && formik.touched.regNumber && (
                <p className="text-red-600 text-xs">
                  {formik.errors.regNumber}
                </p>
              )}
            </div>

            {/* CONTACT EMAIL */}
            <div className="space-y-1">
              <Label>Contact Email</Label>
              <Input
                type="email"
                name="contactEmail"
                value={formik.values.contactEmail}
                onChange={formik.handleChange}
                placeholder="xyz@example.com"
              />
              {formik.errors.contactEmail && formik.touched.contactEmail && (
                <p className="text-red-600 text-xs">
                  {formik.errors.contactEmail}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-red-500 transition text-white rounded-lg py-3"
            >
              Submit & Login
            </Button>
          </form>

          {/* BACK LINK */}
          <div className="text-center mt-3">
            <p className="text-sm">
              <Link
                to="/registerNgo"
                className="text-red-700 font-medium hover:underline"
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
