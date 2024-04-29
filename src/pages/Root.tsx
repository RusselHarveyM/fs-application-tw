import TopNavigation from "@/components/TopNavigation";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <main className="flex flex-col m-auto md:w-fit sm:w-[44rem]">
      <TopNavigation />
      <Outlet />
    </main>
  );
}
