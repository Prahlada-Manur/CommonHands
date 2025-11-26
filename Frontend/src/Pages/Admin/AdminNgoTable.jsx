import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminNgo,
  AdminDeleteNgo,
  AdminRejectNgo,
  AdminVerifyNgo,
  assignEditId,
} from "../../Slices/AdminSlice";

import { useState, useEffect } from "react";

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

import { Search } from "lucide-react";

export default function AdminNgoTable() {
  const dispatch = useDispatch();
  const { data, loading, editId } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 5;

  const [rejectReason, setRejectReason] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminNgo({ q: search, status: statusFilter, page, limit }));
  }, [dispatch, search, statusFilter, page]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    dispatch(AdminDeleteNgo(id));
  };

  const handleVerify = (id) => {
    dispatch(assignEditId(id));
    dispatch(AdminVerifyNgo({ id, formData: { status: "Verified" } }));
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;

    dispatch(
      AdminRejectNgo({
        id: editId,
        formData: { status: "Rejected", reason: rejectReason },
      })
    );

    setRejectReason("");
    setOpenRejectDialog(false);
  };

  const ngoList = data?.ngoList || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || page;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">NGO Management</h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-black" />
          <Input
            placeholder="Search NGO…"
            className="pl-8 bg-white text-black placeholder:text-gray-600"
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
          <SelectContent className="bg-white text-black">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table className="border rounded-md shadow-sm bg-white">
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
              <TableCell colSpan="6" className="text-center py-6 text-gray-500">
                No NGOs Found
              </TableCell>
            </TableRow>
          ) : (
            ngoList.map((ele) => (
              <TableRow key={ele._id}>
                <TableCell>{ele.ngoName}</TableCell>
                <TableCell>{ele.contactEmail}</TableCell>
                <TableCell>{ele.regNumber}</TableCell>
                <TableCell>{ele.status}</TableCell>

                <TableCell className="text-blue-500 underline">
                  <a href={ele.coordinatorAadhaarUrl} target="_blank">
                    Aadhaar
                  </a>
                  <br />
                  <a href={ele.ngoLicenseUrl} target="_blank">
                    License
                  </a>
                </TableCell>

                <TableCell className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(ele._id)}
                  >
                    Delete
                  </Button>

                  {ele.status !== "Verified" && (
                    <Button onClick={() => handleVerify(ele._id)}>
                      Verify
                    </Button>
                  )}

                  {ele.status === "Pending" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        dispatch(assignEditId(ele._id));
                        setOpenRejectDialog(true);
                      }}
                    >
                      Reject
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
          Prev
        </Button>

        <span className="font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
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
            className="my-3 bg-white text-black"
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
