import { SetStateAction, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNavigation from "./components/TopNavigation";
import DashboardContent from "./components/DashboardContent";
import ManageContent from "./components/ManageContent";
import SpaceContent from "./components/SpaceContent";
import SettingsContent from "./components/SettingsContent";
import Popup from "./components/Popup";

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
        <Route path="/" element={<DashboardContent />} />
        <Route path="/dashboard" element={<DashboardContent />} />
        <Route path="/manage" element={<ManageContent />} />
        <Route path="/settings" element={<SettingsContent />} /> 
        <Route path="/space" element={<SpaceContent />} 
        >{!isPopup}</Route>
      </Routes>
      {isPopup && <Popup />}
    </BrowserRouter>
    
  );
}

export default App;
