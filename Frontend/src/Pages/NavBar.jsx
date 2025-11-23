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

export default function NavBar() {
  const { handleLogout, isLoggedIn, user, ngoProfile } =
    useContext(userContext);

  const getAdminLinks = () => [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Profile", path: "/profile" },
  ];

  const getVerifiedNgoLinks = () => [
    { label: "Profile", path: "/ngoprofile" },
    { label: "Tasks", path: "/tasks" },
  ];

  const getContributorLinks = () => [
    { label: "Tasks", path: "/tasks" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="max-w-6xl mx-auto flex justify-between items-center p-2">
      <div className="flex items-center">
        <img
          src={logo}
          alt="CommonHands logo"
          className="h-18 w-18 object-contain px-4"
        />
        <h1 className="md:text-2xl font-extrabold font-serif tracking-wide">
          <Link to="/">
            CommonHands
            <p className="text-sm">The bridge from intent to action</p>
          </Link>
        </h1>
      </div>

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
            {/* LOGOUT */}
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
            </NavigationMenuList>

            <NavigationMenuList>
              {/* Admin */}
              {user?.role === "Admin" &&
                getAdminLinks().map((item) => (
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

              {/* ONLY Verified NGO gets these links */}
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

              {/* Contributor */}
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
