import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function UploadDoc() {
  const [data, setData] = useState({
    coordinatorAadhaar: null,
    ngoLicense: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.files[0] });
  };

  useEffect(() => {
    if (success) navigate("/ngo/status");
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!data.coordinatorAadhaar || !data.ngoLicense) {
      setError("Please upload both documents for verification.");
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append("coordinatorAadhaar", data.coordinatorAadhaar);
      formdata.append("ngoLicense", data.ngoLicense);

      const response = await axios.post("/api/ngo/upload-documents", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      });

      setSuccess(response.data.message || "Documents uploaded successfully!");
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.message || "Document upload failed."
      );
    }
  };

  return (
    <div className="bg-red-100 px-4 py-10 flex justify-center items-start">
      <Card className="w-full max-w-xl shadow-md rounded-xl border border-red-200 bg-white">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">Upload Documents</CardTitle>
          <CardDescription className="text-gray-700 text-sm">
            Please upload the required documents for verification.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {error && (
            <p className="text-red-600 text-center text-sm font-medium">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-600 text-center text-sm font-medium">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label>Upload Coordinator Aadhaar</Label>
              <Input
                type="file"
                name="coordinatorAadhaar"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="cursor-pointer bg-white"
              />
            </div>
            <div className="space-y-1">
              <Label>Upload NGO License</Label>
              <Input
                type="file"
                name="ngoLicense"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="cursor-pointer bg-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-red-500 text-white rounded-lg py-3"
            >
              Upload
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
