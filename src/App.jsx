import { useState } from "react";
import TopNavigation from "./components/TopNavigation";

function App() {
  const [content, setContent] = useState("dashboard");

  return (
    <main className="flex h-screen flex-col">
      <TopNavigation />
    </main>
  );
}

export default App;
