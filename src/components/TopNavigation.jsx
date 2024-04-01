import Logo from "../assets/citu_logo.png";
import Settings from "../assets/Settings.png";
import Button from "./Button";

export default function TopNavigation({ onChangeDisplay, selectedTab }) {
  const highlightNavClass =
    "border-b-4 font-bold border-red-500 text-red-500 rounded-none";
  return (
    <nav className="py-6 px-8 w-full">
      <ul className="flex w-full justify-between">
        <li className="w-1/3">
          <button onClick={() => onChangeDisplay("dashboard")}>
            <img
              src={Logo}
              alt="profile-logo"
              className="w-16 h-16 object-contain hover:cursor-pointer"
            />
          </button>
        </li>
        <li className="w-1/3 flex items-center justify-center">
          <ul className="flex items-center justify-center gap-4">
            <li>
              <Button
                onClick={() => onChangeDisplay("dashboard")}
                cssAdOns={
                  selectedTab === "dashboard" ? highlightNavClass : undefined
                }
              >
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                onClick={() => onChangeDisplay("manage")}
                cssAdOns={
                  selectedTab === "manage" ? highlightNavClass : undefined
                }
              >
                Manage
              </Button>
            </li>
          </ul>
        </li>
        <li className="w-1/3 flex items-center justify-end">
          <button onClick={() => onChangeDisplay("settings")}>
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
