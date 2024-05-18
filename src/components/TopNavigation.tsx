import React, { useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { isAdminLoggedIn, logout } from "@/helper/auth";
import Logo from "../assets/citu_logo.png";
import Button from "./Button";
import { AlignJustify } from "lucide-react";

const highlightNavClass =
  "border-b-4 font-bold border-rose-500 text-rose-500 rounded-none";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  return (
    <NavLink
      to={to}
      className={
        location.pathname.startsWith(to) ? highlightNavClass : undefined
      }
    >
      {children}
    </NavLink>
  );
}

export default function TopNavigation() {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    navigate("/");
    logout();
  }, [navigate]);

  return (
    <nav className="py-6 px-8 mb-4 w-full">
      <ul className="flex w-full justify-between">
        <li className="w-1/3">
          <NavLink to="/home">
            <img
              src={Logo}
              alt="profile-logo"
              className="object-contain w-14 h-14 sm:w-14 sm:h-14 md:w-30 md:h-30 hover:cursor-pointer"
            />
          </NavLink>
        </li>
        <li className="w-1/3 flex items-center justify-center">
          <ul className="flex items-center justify-center gap-4 sm:text-sm md:text-base">
            <NavItem to="/home">Home</NavItem>
            {isAdminLoggedIn() && <NavItem to="/home/manage">Manage</NavItem>}
          </ul>
        </li>
        <li className="w-1/3 flex items-center justify-end">
          <Popover>
            <PopoverTrigger>
              <AlignJustify className="text-rose-500" />
            </PopoverTrigger>
            <PopoverContent className="flex pt-8 mr-8 flex-col justify-center items-center h-fit w-[13rem]">
              <NavItem to="/home/settings">Settings</NavItem>
              <Separator className="my-4" />
              <Button variant="rose" onClick={handleLogout}>
                Log out
              </Button>
            </PopoverContent>
          </Popover>
        </li>
      </ul>
    </nav>
  );
}
