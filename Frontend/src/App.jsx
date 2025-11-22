import NavBar from "./Pages/NavBar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Routes, Route } from "react-router-dom";
import RegisterNgo from "./Pages/Register-Ngo-one";
import UploadDoc from "./Pages/NGO/UploadDoc";
import AdminLanding from "./Pages/Admin/AdminLanding";
import Profile from "./Pages/User/Profile";
import RegisterNgoTwo from "./Pages/register-Ngo-two";
import NgoLanding from "./Pages/NGO/NgoLanding";
import Tasks from "./Pages/User/Tasks";
import NgoStatus from "./Pages/NGO/NgoStatus";
export default function App() {
  return (
    <div className="min-h-screen bg-yellow-50 text-black">
      <header className="w-full bg-red-600 text-gray-100 sticky top-0 z-40 shadow-xl">
        <NavBar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerNgo" element={<RegisterNgo />} />
          <Route path="/uploadDoc" element={<UploadDoc />} />
          <Route path="/admin" element={<AdminLanding />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/registerNgostep2" element={<RegisterNgoTwo />} />
          <Route path="/ngoprofile" element={<NgoLanding />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/ngo/status" element={<NgoStatus />} />
        </Routes>
      </main>
    </div>
  );
}
