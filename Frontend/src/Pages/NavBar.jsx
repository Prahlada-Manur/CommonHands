import { Link } from "react-router-dom";
import logo from "../assets/hands.png";
import userContext from "../Context/userContext";
import { useContext } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
//---------------------------------------------------------------------------------------------
export default function NavBar() {
  const { handleLogout, isLoggedIn } = useContext(userContext);
  return (
    <nav className="max-w-6xl mx-auto flex justify-between items-center p-2">
      <div className="flex items-center">
        <img
          src={logo}
          alt="CommonHands logo"
          className="h-18 w-18  object-contain px-4"
        />
        <h1 className="md:text-2xl font-extrabold font-serif tracking-wide ">
          <Link to="/"> CommonHands</Link>
        </h1>
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuLink
            className="font-medium md:text-lg underline hover:text-black transition"
            asChild
          >
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuList>

        {!isLoggedIn && !localStorage.getItem("token") ? (
          <>
            <NavigationMenuList>
              <NavigationMenuLink
                className="font-medium md:text-lg underline hover:text-black transition"
                asChild
              >
                <Link to="/login">Login</Link>
              </NavigationMenuLink>
              <NavigationMenuLink
                className="font-medium md:text-lg underline hover:text-black transition"
                asChild
              >
                <Link to="/register">Register</Link>
              </NavigationMenuLink>
            </NavigationMenuList>

            <NavigationMenuList>
              <NavigationMenuLink
                className="font-medium md:text-lg underline hover:text-black transition"
                asChild
              >
                <Link to="/registerNgo">Register NGO</Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </>
        ) : (
          <>
            <NavigationMenuList>
              <NavigationMenuLink
                className="font-medium md:text-lg underline hover:text-black transition"
                asChild
              >
                <Link to="/login">
                  <button onClick={handleLogout}>logout</button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </>
        )}
      </NavigationMenu>
    </nav>
  );
}
