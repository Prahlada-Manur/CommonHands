import { useState,useEffect,useContext } from "react";
import userContext from "../../Context/userContext";
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
//------------------------------------------------------------------------------------------------------------------------
export default function UploadDoc() {
  const [data, setData] = useState({
    coordinatorAadhaar: null,
    ngoLicense: null,
  });
  const [error, setError] = useState(" ");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.files[0] });
  };
  //-------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (success) {
      navigate("/ngo/status");
    }
  }, [success]);
  //------------------------------------------------------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form submittted");
    setError("");
    setSuccess("");
    if (!data.coordinatorAadhaar || !data.ngoLicense) {
      setError("Please upload both docuements for verification");
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
      console.log(response.data);
      setSuccess(response.data.message || "Documents uploaded successfully");
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.error || err?.message || "Document upload failed"
      );
    }
  };
  //------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex justify-center items-center bg-yellow-50 px-4">
      <Card className="w-full max-w-xl shadow-lg border border-black p-4 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Upload Documents
          </CardTitle>
          <CardDescription className="text-center">
            Please upload the required documents for verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-red-600 text-center text-sm mb-3">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center text-sm mb-3">{success}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Upload Coordinator Aadhaar</Label>
            <div className="space-y-2">
              <Input
                type="file"
                name="coordinatorAadhaar"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="cursor-pointer bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Upload NGO License</Label>
              <Input
                type="file"
                name="ngoLicense"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="cursor-pointer bg-white"
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-black hover:bg-yellow-700 text-white"
              >
                Upload
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
