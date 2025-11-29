import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchAdminApplication,
  AdminDeleteApplication,
} from "../../Slices/AdminSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ClipboardList, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { DotLoader } from "react-spinners";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminApplications() {
  const dispatch = useDispatch();
  const { data, loading, errors } = useSelector((state) => state.admin);

  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchAdminApplication({ status, page, limit }));
  }, [dispatch, status, page]);

  const applications = data?.applications || [];
  const total = data?.total || 0;

  const totalPages = data?.totalPage || 1;
  const currentPage = data?.currentPage || page;

  const handleDelete = async (id) => {
    await dispatch(AdminDeleteApplication(id));
    await dispatch(fetchAdminApplication({ status, page, limit }));
  };

  return (
    <div className="p-10 space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Applications Overview</h1>
        <p className="text-gray-600">Summary of all volunteer applications.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md p-4 rounded-xl flex items-center gap-4 h-32 hover:shadow-xl transition-all">
          <ClipboardList className="w-10 h-10 text-blue-600" />
          <div>
            <CardTitle>Total Applications</CardTitle>
            <p className="text-3xl font-bold">{total}</p>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 bg-white text-black">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="hoursPending">Hours Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
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
        <Table className="bg-white shadow rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>NGO</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Applied At</TableHead>
              <TableHead>Hours Required</TableHead>
              <TableHead>Hours Logged</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>
                    {app?.applicant
                      ? `${app.applicant.firstName} ${app.applicant.lastName}`
                      : "(deleted user)"}
                  </TableCell>

                  <TableCell>{app.task?.title || "—"}</TableCell>
                  <TableCell>{app.ngo?.ngoName || "—"}</TableCell>

                  <TableCell>
                    {app.task?.deadline
                      ? new Date(app.task.deadline).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{app.hoursRequested || 0}</TableCell>
                  <TableCell>{app.hoursLogged || 0}</TableCell>

                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Application?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the application from the system.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => handleDelete(app._id)}
                            className="bg-red-600 hover:bg-red-700"
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
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Total: {total}</div>

          <div className="flex items-center gap-2">
            <Button disabled={currentPage === 1} onClick={() => setPage(1)}>
              First
            </Button>
            <Button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ArrowLeft />
            </Button>

            <span className="font-medium">
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
        </div>
      )}
    </div>
  );
}
