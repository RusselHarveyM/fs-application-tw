import { useState } from "react";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Space from "./Space";
import RedTag from "./RegTag";
import NoSpace from "./NoSpace";

export default function Spaces() {
  const [content, setContent] = useState({
    selectedTab: "overview",
    selectedSpaceId: undefined,
    data: [],
  });

  function handleSelectTab(selected) {
    setContent((prev) => {
      return {
        ...prev,
        selectedTab: selected,
      };
    });
  }

  let display = <Overview />;
  if (content.selectedTab === "spaces") {
    if (content.selectedSpaceId === undefined) {
      display = <NoSpace />;
    } else {
      display = <Space />;
    }
  } else if (content.selectedTab === "redtags") {
    display = <RedTag />;
  }

  return (
    <div className="flex w-screen h-screen bg-neutral-100">
      <Sidebar
        onSelectTab={handleSelectTab}
        selectedTab={content.selectedTab}
      />
      {display}
    </div>
  );
}
