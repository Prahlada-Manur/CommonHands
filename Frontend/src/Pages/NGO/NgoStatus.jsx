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
    <div className="min-h-screen flex justify-center items-center bg-yellow-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg border border-yellow-200 rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            NGO Verification Status
          </CardTitle>
          <CardDescription>
            Track the progress of your organization’s verification.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {serverErr && (
            <p className="text-red-600 text-center text-sm">{serverErr}</p>
          )}

          {!ngoProfile && (
            <div className="flex flex-col items-center space-y-2 py-6">
              <Loader2 className="animate-spin w-8 h-8 text-yellow-700" />
              <p className="text-gray-700 font-medium">
                Loading your NGO status...
              </p>
            </div>
          )}

          {ngoProfile?.status === "Pending" && (
            <div className="space-y-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-yellow-600">Pending</Badge>
              </div>

              <h2 className="text-xl font-semibold text-center">
                Your NGO Verification is in Progress
              </h2>

              <div className="space-y-1 text-center">
                <p>
                  <strong>NGO Name:{ngoProfile?.ngoName} </strong>
                </p>
                <p className="text-gray-700">
                  Thank you for registering! Our team is reviewing your
                  documents.
                </p>
                <p className="text-gray-600">
                  Please check back in a while to see the updated status.
                </p>
              </div>
            </div>
          )}

          {ngoProfile?.status === "Rejected" && (
            <div className="space-y-4 p-4 bg-red-100 rounded-lg border border-red-300">
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-red-600">Rejected</Badge>
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>

              <h2 className="text-xl font-semibold text-center text-red-700">
                Your NGO Verification has been Rejected
              </h2>

              <div className="space-y-2 text-center">
                <p>
                  <strong>NGO Name:</strong> {ngoProfile?.ngoName}
                </p>
                <p className="text-gray-800">
                  <strong>Reason for Rejection:</strong> {ngoProfile?.reason}
                </p>

                <p className="text-gray-600 pt-2">
                  If you believe this was a mistake, please contact support at{" "}
                  <span className="font-semibold">support@commonhands.in</span>
                  <br />
                  or submit a new registration request.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
