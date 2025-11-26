import AdminNgoTable from "./AdminNgoTable";
import { fetchAdminNgo } from "../../Slices/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { Card, CardTitle } from "@/components/ui/card";
import { Users, Clock, ShieldCheck, XCircle } from "lucide-react";

export default function AdminNgo() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.admin);

  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    dispatch(fetchAdminNgo());
  }, [dispatch]);

  useEffect(() => {
    if (data?.ngoList) {
      setCardData(data.ngoList); 
    }
  }, [data]);

  const totalNgo = cardData.length || 0;
  const pendingNgo = cardData.filter((ngo) => ngo.status === "Pending").length;
  const rejectedNgo = cardData.filter(
    (ngo) => ngo.status === "Rejected"
  ).length;
  const verifiedNgo = totalNgo - pendingNgo - rejectedNgo;

  return (
    <div className="p-10 space-y-8">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">NGO Overview</h1>
        <p className="text-gray-600">
          Summary of all registered NGO activities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md p-4 rounded-xl w-56 h-32 flex items-center gap-4">
          <Users className="w-10 h-10 text-red-600" />
          <div>
            <CardTitle className="text-base font-semibold">
              Total NGOs
            </CardTitle>
            <p className="text-3xl font-bold">{totalNgo}</p>
          </div>
        </Card>

        <Card className="bg-white shadow-md p-4 rounded-xl w-56 h-32 flex items-center gap-4">
          <Clock className="w-10 h-10 text-yellow-600" />
          <div>
            <CardTitle className="text-base font-semibold">
              Pending Approval
            </CardTitle>
            <p className="text-3xl font-bold">{pendingNgo}</p>
          </div>
        </Card>

        <Card className="bg-white shadow-md p-4 rounded-xl w-56 h-32 flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-green-600" />
          <div>
            <CardTitle className="text-base font-semibold">
              Verified NGOs
            </CardTitle>
            <p className="text-3xl font-bold">{verifiedNgo}</p>
          </div>
        </Card>

        <Card className="bg-white shadow-md p-4 rounded-xl w-56 h-32 flex items-center gap-4">
          <XCircle className="w-10 h-10 text-red-600" />
          <div>
            <CardTitle className="text-base font-semibold">
              Rejected NGOs
            </CardTitle>
            <p className="text-3xl font-bold">{rejectedNgo}</p>
          </div>
        </Card>
      </div>

      <AdminNgoTable />
    </div>
  );
}
