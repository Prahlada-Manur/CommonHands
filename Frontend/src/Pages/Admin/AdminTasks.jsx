import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminTasks, AdminDeleteTask } from "../../Slices/AdminSlice";

import {
  List,
  HeartHandshake,
  HandCoins,
  Search,
  ArrowLeft,
  ArrowRight,
  Trash2,
} from "lucide-react";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { DotLoader } from "react-spinners";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function AdminTasks() {
  const dispatch = useDispatch();
  const { data, loading, errors } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const limit = 5;

  useEffect(() => {
    dispatch(fetchAdminTasks({ q: search, status, type, page, limit }));
  }, [dispatch, search, type, status, page]);

  const tasks = data?.tasks || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || page;

  const totalTasks = data?.stats?.totalTasks || 0;
  const totalVolunteerTasks = data?.stats?.totalVolunteerTasks || 0;
  const totalFundingTasks = data?.stats?.totalFundingTasks || 0;
  const totalOpenTasks = data?.stats?.totalOpenTasks || 0;

  const handleDelete = async (id) => {
    await dispatch(AdminDeleteTask(id));
    await dispatch(fetchAdminTasks({ q: search, status, type, page, limit }));
  };

  return (
    <div className="p-10 space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Tasks Overview</h1>
        <p>Summary of all tasks created across platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-2xl transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <List className="h-10 w-10 text-blue-600" />
              <CardTitle>Total Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalTasks}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-10 w-10 text-red-600" />
              <CardTitle>Volunteer Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVolunteerTasks}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HandCoins className="h-10 w-10 text-green-600" />
              <CardTitle>Funding Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalFundingTasks}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <List className="h-10 w-10 text-blue-600" />
              <CardTitle>Open Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalOpenTasks}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative w-64 bg-white rounded-2xl">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-black" />
          <Input
            placeholder="Search tasks..."
            value={search}
            className="pl-8"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={type}
          onValueChange={(value) => {
            setType(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="bg-white w-40 text-black">
            <SelectValue placeholder="Task Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Volunteer">Volunteer</SelectItem>
            <SelectItem value="funding">Funding</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="bg-white w-30 text-black">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <p className="flex justify-center items-center">
          <DotLoader color="#800020" size={100} speedMultiplier={2} />
        </p>
      )}

      {errors && (
        <p className="text-center text-red-600 py-4 font-medium">{errors}</p>
      )}

      {!loading && !errors && (
        <Table className="bg-white rounded-md shadow-sm border">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>NGO</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Required Hours</TableHead>
              <TableHead>Required Volunteers</TableHead>
              <TableHead>Funding Goal</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan="10"
                  className="text-center py-6 text-gray-600"
                >
                  No Tasks Found
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.ngo?.ngoName || "N/A"}</TableCell>
                  <TableCell>{task.createdBy?.email}</TableCell>
                  <TableCell>{task.taskType}</TableCell>
                  <TableCell>{task.taskStatus}</TableCell>
                  <TableCell>
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {task.taskType === "Volunteer"
                      ? task.requiredHours || 0
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {task.taskType === "Volunteer"
                      ? task.volunteersNeeded || 0
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {task.taskType === "funding"
                      ? `₹${task.fundingGoal || 0}`
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(task._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {!loading && !errors && (
        <div className="flex items-center gap-3 mt-6">
          <Button disabled={currentPage === 1} onClick={() => setPage(1)}>
            First
          </Button>

          <Button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ArrowLeft />
          </Button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ArrowRight />
          </Button>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => setPage(totalPages)}
          >
            Last
          </Button>
        </div>
      )}
    </div>
  );
}
