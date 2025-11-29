import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminNgo,
  AdminDeleteNgo,
  AdminRejectNgo,
  AdminVerifyNgo,
  assignEditId,
} from "../../Slices/AdminSlice";
import { useState, useEffect } from "react";

//-------------------------------------------------------------------------------------------------------------------
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Users,
  Clock,
  ShieldCheck,
  XCircle,
  Search,
  Trash2,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { Card, CardTitle } from "@/components/ui/card";

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
import { DotLoader } from "react-spinners";

//------------------------------------------------------------------------------------------------------------------

export default function AdminNgoPage() {
  const dispatch = useDispatch();
  const { data, editId, loading, errors } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 5;

  const [rejectReason, setRejectReason] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminNgo({ q: search, status: statusFilter, page, limit }));
  }, [dispatch, search, statusFilter, page]);

  const handleDelete = async (id) => {
    await dispatch(AdminDeleteNgo(id));
    await dispatch(
      fetchAdminNgo({ q: search, status: statusFilter, page, limit })
    );
  };

  const handleVerify = async (id) => {
    await dispatch(AdminVerifyNgo({ id, formData: { status: "Verified" } }));
    await dispatch(
      fetchAdminNgo({ q: search, status: statusFilter, page, limit })
    );
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;

    await dispatch(
      AdminRejectNgo({
        id: editId,
        formData: { status: "Rejected", reason: rejectReason },
      })
    );

    await dispatch(
      fetchAdminNgo({ q: search, status: statusFilter, page, limit })
    );

    setRejectReason("");
    setOpenRejectDialog(false);
  };

  const ngoList = data?.ngoList || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || page;

  const totalNgo = data?.stats?.total ?? 0;
  const pending = data?.stats?.pending ?? 0;
  const verified = data?.stats?.verified ?? 0;
  const rejected = data?.stats?.rejected ?? 0;

  return (
    <div className="p-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold">NGO Overview</h1>
        <p className="text-gray-600">Summary of all registered NGOs.</p>
      </div>

      {loading && (
        <p className="flex justify-center items-center">
          <DotLoader color="#800020" size={100} speedMultiplier={2} />
        </p>
      )}

      {errors && (
        <p className="text-center py-3 text-red-600 font-medium">{errors}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md p-4 rounded-xl flex items-center gap-4 hover:shadow-2xl transition-all">
          <Users className="w-10 h-10 text-red-600" />
          <div>
            <CardTitle>Total NGOs</CardTitle>
            <p className="text-3xl font-bold">{totalNgo}</p>
          </div>
        </Card>

        <Card className="bg-white shadow-md p-4 rounded-xl flex items-center gap-4 hover:shadow-2xl transition-all">
          <Clock className="w-10 h-10 text-yellow-600" />
          <div>
            <CardTitle>Pending</CardTitle>
            <p className="text-3xl font-bold">{pending}</p>
          </div>
        </Card>

        <Card className="bg-white shadow-md p-4 rounded-xl flex items-center gap-4 hover:shadow-2xl transition-all">
          <ShieldCheck className="w-10 h-10 text-green-600" />
          <div>
            <CardTitle>Verified</CardTitle>
            <p className="text-3xl font-bold">{verified}</p>
          </div>
        </Card>

        <Card className="bg-white shadow-md p-4 rounded-xl flex items-center gap-4 hover:shadow-2xl transition-all">
          <XCircle className="w-10 h-10 text-red-600" />
          <div>
            <CardTitle>Rejected</CardTitle>
            <p className="text-3xl font-bold">{rejected}</p>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-black" />
          <Input
            placeholder="Search NGO..."
            className="pl-8 bg-white text-black"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 bg-white text-black">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table className="border rounded-md bg-white shadow-sm ">
        <TableHeader>
          <TableRow>
            <TableHead>NGO Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Reg No</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ngoList.length === 0 ? (
            <TableRow>
              <TableCell colSpan="6" className="text-center py-6">
                No NGOs Found
              </TableCell>
            </TableRow>
          ) : (
            ngoList.map((ngo) => (
              <TableRow key={ngo._id}>
                <TableCell>{ngo.ngoName}</TableCell>
                <TableCell>{ngo.contactEmail}</TableCell>
                <TableCell>{ngo.regNumber}</TableCell>
                <TableCell>{ngo.status}</TableCell>

                <TableCell className="text-blue-600 underline">
                  <a
                    href={ngo.coordinatorAadhaarUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Aadhaar
                  </a>
                  <br />
                  <a href={ngo.ngoLicenseUrl} target="_blank" rel="noreferrer">
                    License
                  </a>
                </TableCell>
                <TableCell className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete NGO?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This NGO will be
                          permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(ngo._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {ngo.status !== "Verified" && (
                    <Button
                      className="bg-green-500 text-white"
                      onClick={() => handleVerify(ngo._id)}
                    >
                      <Check />
                    </Button>
                  )}
                  {ngo.status === "Pending" && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        dispatch(assignEditId(ngo._id));
                        setOpenRejectDialog(true);
                      }}
                    >
                      <X />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
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
      <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject NGO</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter rejection reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
