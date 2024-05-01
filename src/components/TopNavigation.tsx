import { NavLink, useLocation } from "react-router-dom";
import { isAdminLoggedIn } from "@/helper/auth";
import Logo from "../assets/citu_logo.png";
import Settings from "../assets/Settings.png";

export default function TopNavigation() {
  const location = useLocation();
  const highlightNavClass =
    "border-b-4 font-bold border-red-500 text-red-500 rounded-none";
  return (
    <nav className="py-6 px-8 mb-4 w-[100vw] ">
      <ul className="flex w-full justify-between">
        <li className="w-1/3">
          <NavLink to={"/home"}>
            <img
              src={Logo}
              alt="profile-logo"
              className="md:w-16 md:h-16 sm:w-14 sm:h-14 object-contain hover:cursor-pointer"
            />
          </NavLink>
        </li>
        <li className="w-1/3 flex items-center justify-center">
          <ul className="flex items-center justify-center gap-4 sm:text-sm md:text-base">
            <NavLink
              to={"/home"}
              className={
                location.pathname === "/home" ? highlightNavClass : undefined
              }
            >
              Home
            </NavLink>
            {isAdminLoggedIn() && (
              <NavLink
                to={"manage"}
                className={({ isActive }) =>
                  isActive ? highlightNavClass : undefined
                }
              >
                Manage
              </NavLink>
            )}
          </ul>
        </li>
        <li className="w-1/3 flex items-center justify-end">
          <NavLink to={"settings"}>
            <img
              src={Settings}
              alt="settings-icon"
              className="hover:cursor-pointer hover:brightness-50 md:w-6 md:h-6 sm:w-6 sm:h-6"
            />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
