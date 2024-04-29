import { useEffect, useState } from "react";
import DashboardContent from "../components/DashboardContent";
import Popup from "../components/Popup";

export default function Home() {
  const [isPopup, setIsPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopup(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col ">
      {isPopup && (
        <Popup>
          <p>
            Welcome back,{" "}
            <span className="text-red-500 font-bold text-sm md:text-xl">
              Cebu Institute of Technology
            </span>{" "}
            !
          </p>
        </Popup>
      )}
      <DashboardContent />
    </div>
  );
}
