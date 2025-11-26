import { Link } from "react-router-dom";
import logo from "../assets/newlogo.png";
import userContext from "../Context/userContext";
import { useContext } from "react";

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

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

  const getVerifiedNgoLinks = () => [
    { label: "Profile", path: "/ngoprofile" },
    { label: "Tasks", path: "/tasks" },
  ];

  const getContributorLinks = () => [
    { label: "Tasks", path: "/tasks" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 font-semibold">
      {/* LEFT SECTION */}
      <div className="flex items-center -ml-2">
        <img
          src={logo}
          alt="CommonHands logo"
          className="h-16 w-16 object-contain mr-3"
        />

        <h1 className="md:text-2xl font-extrabold font-serif tracking-wide leading-tight">
          <Link to="/">
            CommonHands
            <p className="text-xs font-normal mt-0.5">
              The bridge from intent to action
            </p>
          </Link>
        </h1>
      </div>

      {/* RIGHT MENU */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link className="md:text-lg hover:text-black transition" to="/">
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        {/* IF NOT LOGGED IN */}
        {!isLoggedIn && !localStorage.getItem("token") ? (
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link className="md:text-lg" to="/login">
                  Login
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link className="md:text-lg" to="/register">
                  Register
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        ) : (
          <>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button
                    onClick={handleLogout}
                    className="md:text-lg hover:text-black transition"
                  >
                    Logout
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* ADMIN MENU */}
              {user?.role === "Admin" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="md:text-lg hover:text-black transition flex items-center gap-1 cursor-pointer">
                      Dashboard
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" className="w-48">
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
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.path}
                        className="md:text-lg hover:text-black transition"
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

              {/* CONTRIBUTOR LINKS */}
              {user?.role === "Contributor" &&
                getContributorLinks().map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.path}
                        className="md:text-lg hover:text-black transition"
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
            </NavigationMenuList>
          </>
        )}
      </NavigationMenu>
    </nav>
  );
}
