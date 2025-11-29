import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminUsers, AdminDeleteUser } from "../../Slices/AdminSlice";

import { Card, CardTitle } from "@/components/ui/card";
import {
  Users,
  ShieldCheck,
  UserCheck,
  Search,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function AdminUsers() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, loading, errors } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminUsers({ q: search, role, page, limit }));
  }, [dispatch, search, role, page]);

  const userList = data?.userList || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || page;

  const totalUsers = data?.total || 0;
  const totalNGOs = data?.totalNGOs || 0;
  const totalContributors = data?.totalContributors || 0;

  const handleDelete = async (id) => {
    await dispatch(AdminDeleteUser(id));
    await dispatch(fetchAdminUsers({ q: search, role, page, limit }));
  };

  return (
    <div className="p-10 space-y-10">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Users Overview</h1>
        <p className="text-gray-600">
          Summary of all registered users in the system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md p-4 rounded-xl flex items-center gap-4 h-32 w-full hover:shadow-2xl transition-all">
          <Users className="w-10 h-10 text-blue-600" />
          <div>
            <CardTitle>Total Users</CardTitle>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
        </Card>

        <Card className="bg-white shadow-md p-4 rounded-xl flex items-center gap-4 h-32 w-full hover:shadow-2xl transition-all">
          <ShieldCheck className="w-10 h-10 text-green-600" />
          <div>
            <CardTitle>NGOs</CardTitle>
            <p className="text-3xl font-bold">{totalNGOs}</p>
          </div>
        </Card>

        <Card className="bg-white shadow-md p-4 rounded-xl flex items-center gap-4 h-32 w-full hover:shadow-2xl transition-all">
          <UserCheck className="w-10 h-10 text-orange-600" />
          <div>
            <CardTitle>Contributors</CardTitle>
            <p className="text-3xl font-bold">{totalContributors}</p>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-64 bg-white rounded-xl">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-black" />
          <Input
            placeholder="Search Users…"
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 bg-white text-black">
            <SelectValue placeholder="Role Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="NGO">NGO</SelectItem>
            <SelectItem value="Contributor">Contributor</SelectItem>
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
        <Table className="border rounded-md shadow-sm bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {userList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan="5"
                  className="text-center py-6 text-gray-500"
                >
                  No Users Found
                </TableCell>
              </TableRow>
            ) : (
              userList.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>{user.role}</TableCell>

                  <TableCell>
                    {user.role !== "NGO" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This user will be
                              permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDelete(user._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
      )}
    </div>
  );
}
