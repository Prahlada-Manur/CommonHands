import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdminStats } from "../../Slices/AdminSlice";
import userContext from "../../Context/userContext";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Users,
  List,
  ClipboardList,
  Building2,
  UserCircle,
} from "lucide-react";

import { DotLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const { data, loading, errors } = useSelector((state) => state.admin);
  const stats = data || {};

  useEffect(() => {
    dispatch(AdminStats());
  }, [dispatch]);

  const totalNGOs = stats.totalNgo || 0;
  const totalUsers = stats.totalUsers || 0;
  const totalTasks = stats.totalTasks || 0;
  const totalApplications = stats.totalApplication || 0;

  const taskData = [
    { name: "Volunteer", value: stats.totalVolunteerTasks || 0 },
    { name: "Funding", value: stats.totalFundingTasks || 0 },
    { name: "Open", value: stats.totalOpenTasks || 0 },
  ];

  const ngoStatusData = [
    { name: "Pending", value: stats.pendingNgo || 0 },
    { name: "Verified", value: stats.verifiedNgo || 0 },
    { name: "Rejected", value: stats.rejectedNgo || 0 },
  ];

  const COLORS = ["#2563eb", "#16a34a", "#f97316"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center mt-20">
          <DotLoader color="#800020" size={80} />
        </div>
      )}

      {/* ERRORS */}
      {errors && (
        <p className="text-center text-red-600 py-4 font-medium">{errors}</p>
      )}

      {!loading && !errors && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            {/* ADMIN PROFILE */}
            <Card className="shadow rounded-xl p-4 border hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <UserCircle className="w-10 h-10 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Admin</p>
                  <p className="text-gray-600 text-xs">{user?.email}</p>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <p className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-500">Role: {user?.role}</p>
              </div>
            </Card>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 gap-3">
              {/* NGOs */}
              <Card className="shadow p-3 rounded-xl hover:shadow-lg transition">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-sm">NGOs</CardTitle>
                </div>
                <p className="text-xl font-bold mt-1">{totalNGOs}</p>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => navigate("/admin/ngo")}
                >
                  View
                </Button>
              </Card>

              {/* Tasks */}
              <Card className="shadow p-3 rounded-xl hover:shadow-lg transition">
                <div className="flex items-center gap-2">
                  <List className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm">Tasks</CardTitle>
                </div>
                <p className="text-xl font-bold mt-1">{totalTasks}</p>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => navigate("/admin/tasks")}
                >
                  View
                </Button>
              </Card>

              {/* Users */}
              <Card className="shadow p-3 rounded-xl hover:shadow-lg transition">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-sm">Users</CardTitle>
                </div>
                <p className="text-xl font-bold mt-1">{totalUsers}</p>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => navigate("/admin/users")}
                >
                  View
                </Button>
              </Card>

              {/* Applications */}
              <Card className="shadow p-3 rounded-xl hover:shadow-lg transition">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-sm">Applications</CardTitle>
                </div>
                <p className="text-xl font-bold mt-1">{totalApplications}</p>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => navigate("/admin/applications")}
                >
                  View
                </Button>
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN — CHART AREA */}
          <div className="lg:col-span-2">
            <Card className="shadow rounded-xl border p-6 hover:shadow-lg transition">
              <CardTitle className="text-lg font-semibold mb-6">
                Platform Analytics
              </CardTitle>

              {/* TWO CHARTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TASK CHART */}
                <div className="h-64 bg-gray-50 rounded-lg p-3 shadow-inner">
                  <p className="font-medium text-sm mb-2">Task Summary</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                        {taskData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-64 bg-gray-50 rounded-lg p-3 shadow-inner">
                  <p className="font-medium text-sm mb-2">NGO Status</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ngoStatusData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                        {ngoStatusData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
