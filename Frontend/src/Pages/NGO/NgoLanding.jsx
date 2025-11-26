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
    <div className="bg-red-100 px-4 py-10 flex justify-center items-start">
      {loading && (
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading NGO profile...
        </p>
      )}

      {!loading && errors && (
        <p className="text-red-600 text-lg font-semibold">Error: {errors}</p>
      )}

      {!loading && !errors && !data && (
        <p className="text-gray-600 text-lg">No NGO profile found.</p>
      )}

      {!loading && !errors && data && (
        <Card className="w-full max-w-5xl shadow-md rounded-xl border border-red-200 bg-white">
          <div className="flex gap-6 items-center p-6 border-b border-red-200">
            <Avatar className="w-32 h-32 border-4 border-red-300 shadow">
              <AvatarImage src={data.ngoProfilePic} />
              <AvatarFallback className="bg-red-400 text-white text-3xl">
                {data.ngoName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                {data.ngoName}
              </CardTitle>
              <CardDescription className="text-gray-700 text-base mt-1">
                Verified NGO Profile Overview
              </CardDescription>
              <div className="mt-3">
                <Badge className="px-4 py-1.5 text-sm rounded-md bg-green-600">
                  Verified
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="px-6 pb-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">
                  Basic Information
                </h3>
                <Separator className="mb-3" />
                <div className="space-y-1 text-gray-800 text-sm">
                  <p>
                    <strong>Registration Number:</strong> {data.regNumber}
                  </p>
                  <p>
                    <strong>Contact Email:</strong> {data.contactEmail}
                  </p>
                </div>
              </section>

              <section className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">
                  Uploaded Documents
                </h3>
                <Separator className="mb-3" />
                <div className="space-y-1 text-gray-800 text-sm">
                  <p>
                    <strong>Coordinator Aadhaar:</strong>{" "}
                    <a
                      href={data.coordinatorAadhaarUrl}
                      target="_blank"
                      className="text-red-700 underline hover:text-red-900"
                    >
                      View
                    </a>
                  </p>
                  <p>
                    <strong>NGO License:</strong>{" "}
                    <a
                      href={data.ngoLicenseUrl}
                      target="_blank"
                      className="text-red-700 underline hover:text-red-900"
                    >
                      View
                    </a>
                  </p>
                </div>
              </section>

              <section className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">
                  Coordinator Details
                </h3>
                <Separator className="mb-3" />
                <div className="space-y-1 text-gray-800 text-sm">
                  <p>
                    <strong>Name:</strong> {data.user?.firstName}{" "}
                    {data.user?.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {data.user?.email}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {data.user?.mobileNumber}
                  </p>
                </div>
              </section>

              <section className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">
                  System Information
                </h3>
                <Separator className="mb-3" />
                <div className="space-y-1 text-gray-800 text-sm">
                  <p>
                    <strong>ID:</strong> {data._id}
                  </p>
                  <p>
                    <strong>Created At:</strong> {data.createdAt}
                  </p>
                  <p>
                    <strong>Updated At:</strong> {data.updatedAt}
                  </p>
                  <p>
                    <strong>Rejection Reason:</strong> {data.reason || "None"}
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
