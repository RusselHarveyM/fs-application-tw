import Logo from "../assets/citu_logo.png";
import Settings from "../assets/Settings.png";
import Button from "./Button";

export default function TopNavigation() {
  return (
    <nav className="w-screen py-6 px-8">
      <ul className="flex w-full justify-between">
        <li className="w-1/3">
          <button>
            <img
              src={Logo}
              alt="profile-logo"
              className="w-16 h-16 object-contain hover:cursor-pointer"
            />
          </button>
        </li>
        <li className="w-1/3 flex items-center justify-center">
          <ul className="flex items-center justify-center gap-4 ">
            <li className="hover:cursor-pointer">
              <Button>Dashboard</Button>
            </li>
            <li className="hover:cursor-pointer">
              <Button>Manage</Button>
            </li>
          </ul>
        </li>
        <li className="w-1/3 flex items-center justify-end">
          <button>
            <img
              src={Settings}
              alt="settings-icon"
              className="hover:cursor-pointer hover:brightness-50"
            />
          </button>
        </li>
      </ul>
    </nav>
  );
}
