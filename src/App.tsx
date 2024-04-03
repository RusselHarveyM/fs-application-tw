import { SetStateAction, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TopNavigation from "./components/TopNavigation";
import DashboardContent from "./components/DashboardContent";
import ManageContent from "./components/ManageContent";
import SpaceContent from "./components/SpaceContent";
import SettingsContent from "./components/SettingsContent";
import Popup from "./components/Popup";
import path from "path";

function App() {
  const [contentDisplay, setContentDisplay] = useState("dashboard");
  const [isPopup, setIsPopup] = useState(true);

  function handleContentDisplay(selected: SetStateAction<string>) {
    setContentDisplay(selected);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopup(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><TopNavigation onChangeDisplay={handleContentDisplay} selectedTab={contentDisplay}/><DashboardContent /></>}/>
        <Route path="*" element={<><TopNavigation onChangeDisplay={handleContentDisplay} selectedTab={contentDisplay}/><DashboardContent /></>}/>
        <Route path="/dashboard" element={<><TopNavigation onChangeDisplay={handleContentDisplay} selectedTab={contentDisplay}/><DashboardContent /></>}/>
        <Route path="/manage" element={<><TopNavigation onChangeDisplay={handleContentDisplay} selectedTab={contentDisplay}/><ManageContent /></>}/>
        <Route path="/settings" element={<><TopNavigation onChangeDisplay={handleContentDisplay} selectedTab={contentDisplay}/><SettingsContent /></>}/>
        <Route path="/space" element={<SpaceContent />} />
      </Routes>
      {isPopup && !(location.pathname ==='/space') &&(
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
    </BrowserRouter>
  );
}

export default App;
