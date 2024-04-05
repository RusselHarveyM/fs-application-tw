import TopNavigation from "@/components/TopNavigation";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <main className="flex flex-col m-auto">
      <TopNavigation />
      <Outlet />
    </main>
  );
}
