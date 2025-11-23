import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNgoProfile } from "../../Slices/NgoSlice";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NgoLanding() {
  const dispatch = useDispatch();
  const { data, loading, errors } = useSelector((state) => state.ngo);

  useEffect(() => {
    dispatch(fetchNgoProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex justify-center items-start bg-yellow-50 p-10">
      {loading && (
        <p className="text-xl font-medium text-gray-700 animate-pulse">
          Loading NGO profile...
        </p>
      )}

      {!loading && errors && (
        <p className="text-red-600 text-xl font-semibold">Error: {errors}</p>
      )}

      {!loading && !errors && !data && (
        <p className="text-gray-600 text-lg">No NGO profile found.</p>
      )}

      {!loading && !errors && data && (
        <Card className="w-full max-w-6xl shadow-xl border border-yellow-200 rounded-2xl bg-white">

          {/* HEADER */}
          <div className="flex gap-8 items-center p-8 border-b border-yellow-200">
            <div className="bg-yellow-100 rounded-2xl p-4 border border-yellow-300 shadow">
              <Avatar className="w-40 h-40 border-4 border-yellow-500 shadow-lg">
                <AvatarImage src={data.ngoProfilePic} />
                <AvatarFallback className="bg-yellow-500 text-white text-4xl">
                  {data.ngoName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <CardTitle className="text-4xl font-bold tracking-tight">
                {data.ngoName}
              </CardTitle>
              <CardDescription className="text-gray-700 text-lg mt-1">
                Verified NGO Profile Overview
              </CardDescription>
              <div className="mt-3">
                <Badge className="px-5 py-1.5 text-sm rounded-md bg-green-600">
                  Verified
                </Badge>
              </div>
            </div>
          </div>

          {/* 2-COLUMN GRID SECTIONS */}
          <CardContent className="px-10 pb-10 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* BASIC INFORMATION */}
              <section className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
                <Separator className="mb-3" />
                <div className="space-y-2 text-gray-800">
                  <p><strong>Registration Number:</strong> {data.regNumber}</p>
                  <p><strong>Contact Email:</strong> {data.contactEmail}</p>
                </div>
              </section>

              {/* DOCUMENTS */}
              <section className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Uploaded Documents</h3>
                <Separator className="mb-3" />
                <div className="space-y-2 text-gray-800">
                  <p>
                    <strong>Coordinator Aadhaar:</strong>{" "}
                    <a
                      href={data.coordinatorAadhaarUrl}
                      target="_blank"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View Document
                    </a>
                  </p>
                  <p>
                    <strong>NGO License:</strong>{" "}
                    <a
                      href={data.ngoLicenseUrl}
                      target="_blank"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View Document
                    </a>
                  </p>
                </div>
              </section>

              {/* COORDINATOR DETAILS */}
              <section className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Coordinator Details</h3>
                <Separator className="mb-3" />
                <div className="space-y-2 text-gray-800">
                  <p>
                    <strong>Name:</strong> {data.user?.firstName} {data.user?.lastName}
                  </p>
                  <p><strong>Email:</strong> {data.user?.email}</p>
                  <p><strong>Mobile Number:</strong> {data.user?.mobileNumber}</p>
                </div>
              </section>

              {/* SYSTEM INFORMATION */}
              <section className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">System Information</h3>
                <Separator className="mb-3" />
                <div className="space-y-2 text-gray-800">
                  <p><strong>ID:</strong> {data._id}</p>
                  <p><strong>Created At:</strong> {data.createdAt}</p>
                  <p><strong>Updated At:</strong> {data.updatedAt}</p>
                  <p><strong>Rejection Reason:</strong> {data.reason || "None"}</p>
                </div>
              </section>

            </div>
          </CardContent>

        </Card>
      )}
    </div>
  );
}
