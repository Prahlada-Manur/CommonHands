import { Link } from "react-router-dom";
import logo from "../assets/newlogo.png";
import userContext from "../Context/userContext";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { resetNgoData } from "../Slices/NgoSlice";
import { resetAdminData } from "../Slices/AdminSlice";

import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavBar() {
  const { handleLogout, isLoggedIn, user, ngoProfile } =
    useContext(userContext);
  const dispatch = useDispatch();

  const getVerifiedNgoLinks = () => [
    { label: "Profile", path: "/ngoprofile" },
    { label: "Dashboard", path: "/ngo/dashboard" },
    { label: "Tasks", path: "/ngo/tasks" },
    { label: "Applications", path: "/ngo/application" },
    { label: "Donations", path: "/ngo/donation" },
  ];

  const getContributorLinks = () => [
    { label: "Tasks", path: "/tasks" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <nav
      className="
        max-w-7xl mx-auto w-full
        flex flex-col md:flex-row 
        justify-between items-center 
        gap-4 md:gap-0
        px-6 py-3 font-semibold
      "
    >
      {/* LEFT SECTION — LOGO */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="CommonHands logo"
          className="h-14 w-14 object-contain"
        />

        <h1 className="text-xl md:text-2xl font-extrabold font-serif leading-tight">
          <Link to="/">
            CommonHands
            <p className="text-xs font-normal mt-0.5">
              The bridge from intent to action
            </p>
          </Link>
        </h1>
      </div>

      {/* RIGHT SECTION — MENU */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        {/* HOME */}
        <Link className="text-base md:text-lg hover:text-black" to="/">
          Home
        </Link>

        {/* NOT LOGGED IN */}
        {!isLoggedIn && !localStorage.getItem("token") ? (
          <>
            <Link className="text-base md:text-lg hover:text-black" to="/login">
              Login
            </Link>

            <Link
              className="text-base md:text-lg hover:text-black"
              to="/register"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {/* ADMIN MENU */}
            {user?.role === "Admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-base md:text-lg hover:text-black flex items-center gap-1 cursor-pointer">
                    Dashboard
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard">Overview</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/admin/ngo">NGO</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/admin/users">Users</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/admin/tasks">Tasks</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/admin/applications">Applications</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* VERIFIED NGO LINKS */}
            {ngoProfile?.status === "Verified" &&
              getVerifiedNgoLinks().map((item) => (
                <Link
                  key={item.path}
                  className="text-base md:text-lg hover:text-black"
                  to={item.path}
                >
                  {item.label}
                </Link>
              ))}

            {/* CONTRIBUTOR LINKS */}
            {user?.role === "Contributor" &&
              getContributorLinks().map((item) => (
                <Link
                  key={item.path}
                  className="text-base md:text-lg hover:text-black"
                  to={item.path}
                >
                  {item.label}
                </Link>
              ))}

            {/* LOGOUT — ALWAYS LAST */}
            <button
              onClick={() => {
                handleLogout();
                dispatch(resetNgoData());
                dispatch(resetAdminData());
              }}
              className="text-base md:text-lg hover:text-black"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
