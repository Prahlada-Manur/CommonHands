import { useContext } from "react";
import userContext from "../../Context/userContext";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2 } from "lucide-react";

export default function NgoStatus() {
  const { ngoProfile, serverErr } = useContext(userContext);

  return (
    <div className="bg-red-100 px-4 py-10 flex justify-center items-start">
      <Card className="w-full max-w-2xl shadow-md rounded-xl border border-red-200 bg-white">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">
            NGO Verification Status
          </CardTitle>
          <CardDescription className="text-gray-700 text-sm">
            Track the progress of your organization’s verification.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {serverErr && (
            <p className="text-red-600 text-center text-sm">{serverErr}</p>
          )}

          {!ngoProfile && (
            <div className="flex flex-col items-center space-y-2 py-6">
              <Loader2 className="animate-spin w-7 h-7 text-red-600" />
              <p className="text-gray-700 font-medium">
                Loading your NGO status...
              </p>
            </div>
          )}

          {ngoProfile?.status === "Pending" && (
            <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-yellow-600 text-white px-3 py-1">
                  Pending
                </Badge>
              </div>

              <h2 className="text-lg font-semibold text-center">
                Your NGO Verification is in Progress
              </h2>

              <div className="space-y-1 text-center text-sm">
                <p>
                  <strong>NGO Name:</strong> {ngoProfile?.ngoName}
                </p>
                <p className="text-gray-700">
                  Thank you for registering. Our team is reviewing your
                  documents.
                </p>
                <p className="text-gray-600">
                  Please check back later for status updates.
                </p>
              </div>
            </div>
          )}

          {ngoProfile?.status === "Rejected" && (
            <div className="space-y-3 p-4 bg-red-100 rounded-lg border border-red-300">
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-red-600 text-white px-3 py-1">
                  Rejected
                </Badge>
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>

              <h2 className="text-lg font-semibold text-center text-red-700">
                Your NGO Verification Has Been Rejected
              </h2>

              <div className="space-y-2 text-center text-sm">
                <p>
                  <strong>NGO Name:</strong> {ngoProfile?.ngoName}
                </p>

                <p className="text-gray-800">
                  <strong>Reason:</strong> {ngoProfile?.reason}
                </p>

                <p className="text-gray-600 pt-1">
                  If you believe this is incorrect, contact support at{" "}
                  <span className="font-semibold">support@commonhands.in</span>{" "}
                  or submit a new registration.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
