import { SetStateAction, useEffect, useState } from "react";
import TopNavigation from "./components/TopNavigation";
import DashboardContent from "./components/DashboardContent";
import ManageContent from "./components/ManageContent";
import SettingsContent from "./components/SettingsContent";
import Popup from "./components/Popup";

import axios from "axios";
import { DataContext } from "./data/data-context";

function App() {
  const [contentDisplay, setContentDisplay] = useState("dashboard");
  const [isPopup, setIsPopup] = useState(true);
  const [data, setData] = useState({
    users: undefined,
    buildings: undefined,
    rooms: undefined,
    spaces: undefined,
  });

  function handleContentDisplay(selected: SetStateAction<string>) {
    setContentDisplay(selected);
  }

  async function fetchAllData() {
    try {
      const newData = {
        users: [],
        buildings: [],
        rooms: [],
        spaces: [],
      };
      newData.users = (
        await axios.get(
          "https://fs-backend-copy-production.up.railway.app/api/user"
        )
      ).data;
      newData.buildings = (
        await axios.get(
          "https://fs-backend-copy-production.up.railway.app/api/buildings"
        )
      ).data;
      newData.rooms = (
        await axios.get(
          "https://fs-backend-copy-production.up.railway.app/api/rooms"
        )
      ).data;
      newData.spaces = (
        await axios.get(
          "https://fs-backend-copy-production.up.railway.app/api/space"
        )
      ).data;
      console.log(newData);
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopup(false);
    }, 5000);
    fetchAllData();
    return () => clearTimeout(timer);
  }, []);

  let content = <DashboardContent />;

  if (contentDisplay === "manage") content = <ManageContent />;
  else if (contentDisplay === "settings") content = <SettingsContent />;

  const dataCtx = {
    users: data.users,
    buildings: data.buildings,
    rooms: data.rooms,
    spaces: data.spaces,
  };

  return (
    <main className="flex flex-col m-auto">
      <TopNavigation
        onChangeDisplay={handleContentDisplay}
        selectedTab={contentDisplay}
      />
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
      <DataContext.Provider value={dataCtx}>{content}</DataContext.Provider>
    </main>
  );
}

export default App;
