import NavBar from "./Pages/NavBar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Routes, Route } from "react-router-dom";
import RegisterNgo from "./Pages/Register-Ngo-one";
import UploadDoc from "./Pages/NGO/UploadDoc";
import Profile from "./Pages/User/Profile";
import RegisterNgoTwo from "./Pages/register-Ngo-two";
import NgoLanding from "./Pages/NGO/NgoLanding";
import Tasks from "./Pages/User/Tasks";
import NgoStatus from "./Pages/NGO/NgoStatus";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminApplications from "./Pages/Admin/AdminApplications";
import AdminTasks from "./Pages/Admin/AdminTasks";
import AdminNgo from "./Pages/Admin/AdminNgo";
import AdminUsers from "./Pages/Admin/AdminUsers";
//-------------------------------------------------------------------------------------------------------------------------
export default function App() {
  return (
    <div className="min-h-screen bg-red-100 text-black">
      <header className="w-auto bg-red-800 text-gray-100 sticky top-0 z-40 shadow-xl">
        <NavBar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerNgo" element={<RegisterNgo />} />
          <Route path="/uploadDoc" element={<UploadDoc />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/registerNgostep2" element={<RegisterNgoTwo />} />
          <Route path="/ngoprofile" element={<NgoLanding />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/ngo/status" element={<NgoStatus />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/ngo" element={<AdminNgo />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
        </Routes>
      </main>
    </div>
  );
}
