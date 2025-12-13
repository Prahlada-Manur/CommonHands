import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchNgoTasks } from "../../Slices/NgoSlice";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { DotLoader } from "react-spinners";

export default function NgoTasks() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");

  const { data, loading, errors } = useSelector((state) => state.ngo);

  useEffect(() => {
    dispatch(fetchNgoTasks({ page, limit: 5, status, type }));
  }, [dispatch, page, status, type]);

  // View button handler
  const handleView = (task) => {
    console.log("View task:", task);
    // TODO: Open modal or navigate to task details page
  };

  return (
    <div className="px-6 py-10 bg-red-100 min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-extrabold text-[#800020] mb-6">
        NGO Tasks List
      </h1>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        {/* STATUS FILTER */}
        <select
          className="border p-2 rounded bg-white shadow"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Completed">Completed</option>
        </select>

        {/* TYPE FILTER */}
        <select
          className="border p-2 rounded bg-white shadow"
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
        >
          <option value="All">All Types</option>
          <option value="Volunteer">Volunteer</option>
          <option value="funding">Funding</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center mt-16">
          <DotLoader color="#800020" size={60} />
        </div>
      )}

      {/* ERROR */}
      {errors && (
        <p className="text-red-600 text-lg font-semibold mt-4">{errors}</p>
      )}

      {/* NO TASKS */}
      {!loading && data?.tasks?.length === 0 && (
        <p className="text-center text-gray-700 mt-10 text-xl font-semibold">
          No tasks found
        </p>
      )}

      {/* TASK TABLE */}
      {!loading && data?.tasks?.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-[#800020]">
                  Title
                </TableHead>
                <TableHead className="font-semibold text-[#800020]">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-[#800020]">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-[#800020]">
                  Created By
                </TableHead>
                <TableHead className="font-semibold text-[#800020]">
                  Created At
                </TableHead>
                <TableHead className="font-semibold text-[#800020]">
                  Deadline
                </TableHead>
                <TableHead className="font-semibold text-[#800020]">
                  View
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.tasks.map((task) => (
                <TableRow key={task._id} className="hover:bg-gray-50">
                  {/* Title */}
                  <TableCell className="font-medium">{task.title}</TableCell>

                  {/* Type */}
                  <TableCell className="capitalize">{task.taskType}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={`px-2 py-1 rounded-full ${
                        task.taskStatus === "Open"
                          ? "bg-green-600"
                          : task.taskStatus === "Completed"
                          ? "bg-blue-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {task.taskStatus}
                    </Badge>
                  </TableCell>

                  {/* Created By */}
                  <TableCell>
                    {task.createdBy
                      ? `${task.createdBy.firstName} ${task.createdBy.lastName}`
                      : "Unknown"}
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </TableCell>

                  {/* Deadline */}
                  <TableCell>
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  {/* View Button */}
                  <TableCell>
                    <button
                      onClick={() => handleView(task)}
                      className="px-3 py-1 bg-[#800020] text-white rounded-md text-sm hover:bg-red-900"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
