import { useState } from "react";
import Button from "../components/Button";
import Page from "../payments/page copy"; // Import the Page component

export default function ManageContent() {
  const [tableContent, setTableContent] = useState("users");

  function onChangeTableContent(selected) {
    setTableContent(selected);
  }

  // CSS classes for highlighting the selected tab
  const highlightNavClass =
    "border-b-4 font-bold border-red-500 text-red-500 rounded-none";

  return (
    <div className="flex flex-col w-full m-auto py-6 px-8 mb-20">
      <div className="flex justify-between">
        <menu className="flex mb-8">
          <Button
            onClick={() => onChangeTableContent("users")}
            cssAdOns={tableContent === "users" ? highlightNavClass : undefined}
          >
            Users
          </Button>
          <Button
            onClick={() => onChangeTableContent("buildings")}
            cssAdOns={
              tableContent === "buildings" ? highlightNavClass : undefined
            }
          >
            Buildings
          </Button>
          <Button
            onClick={() => onChangeTableContent("rooms")}
            cssAdOns={tableContent === "rooms" ? highlightNavClass : undefined}
          >
            Rooms
          </Button>
          <Button
            onClick={() => onChangeTableContent("spaces")}
            cssAdOns={tableContent === "spaces" ? highlightNavClass : undefined}
          >
            Spaces
          </Button>
        </menu>
      </div>
      {/* Render different content based on the selected tab */}
      <Page tableContent={tableContent} /> 
      {/* Add similar conditional rendering for other tabs */}
    </div>
  );
}
