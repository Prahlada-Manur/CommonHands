import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchNgoDashboard } from "../../Slices/NgoSlice";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DotLoader } from "react-spinners";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function NgoDashboard() {
  const dispatch = useDispatch();
  const { data, loading, errors } = useSelector((state) => state.ngo);

  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchNgoDashboard({ status: statusFilter, page, limit: 5 }));
  }, [dispatch, statusFilter, page]);

  return (
    <div className="px-4 py-6 bg-red-100 min-h-screen">
      {/* TITLE */}
      <h1 className="text-3xl font-extrabold mb-6 text-[#800020]">
        NGO Dashboard
      </h1>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center mt-20">
          <DotLoader color="#800020" size={70} />
        </div>
      )}

      {/* ERROR */}
      {errors && <p className="text-red-600 text-lg font-semibold">{errors}</p>}

      {/* DASHBOARD CONTENT */}
      {!loading && data && data.tasks && (
        <div className="space-y-8">
          {/* TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-[#800020] text-lg">
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-gray-800">
                {data.totalTask}
              </CardContent>
            </Card>

            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-[#800020] text-lg">
                  Open Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-green-700">
                {data.tasks.filter((t) => t.taskStatus === "Open").length}
              </CardContent>
            </Card>

            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-[#800020] text-lg">
                  Completed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-blue-700">
                {data.tasks.filter((t) => t.taskStatus === "Completed").length}
              </CardContent>
            </Card>
          </div>

          {/* FILTER BUTTONS — MOVED BELOW CARDS */}
          <div className="flex flex-wrap gap-2">
            {["All", "Open", "Completed"].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setPage(1);
                  setStatusFilter(option);
                }}
                className={`px-4 py-1.5 rounded-full border transition ${
                  statusFilter === option
                    ? "bg-[#800020] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* TABLE SECTION USING SHADCN TABLE */}
          <Card className="shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#800020]">
                Tasks Overview
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Funding Goal</TableHead>
                    <TableHead>Raised</TableHead>
                    <TableHead>Donations</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell className="capitalize">
                        {task.taskType}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`${
                            task.taskStatus === "Open"
                              ? "bg-green-600"
                              : task.taskStatus === "Completed"
                              ? "bg-blue-600"
                              : "bg-gray-600"
                          } px-3 py-1 rounded-full`}
                        >
                          {task.taskStatus}
                        </Badge>
                      </TableCell>

                      <TableCell>{task.applicationCount}</TableCell>

                      <TableCell>
                        {task.taskType === "funding"
                          ? `₹${task.fundingGoal}`
                          : "-"}
                      </TableCell>

                      <TableCell>
                        {task.taskType === "funding"
                          ? `₹${task.totalFundsRaised}`
                          : "-"}
                      </TableCell>

                      <TableCell>
                        {task.taskType === "funding"
                          ? task.totalDonationsCount
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-lg border ${
                page === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            <p className="text-gray-700 font-medium">
              Page {data.currentPage} / {data.totalPage}
            </p>

            <button
              disabled={page === data.totalPage}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-lg border ${
                page === data.totalPage
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
