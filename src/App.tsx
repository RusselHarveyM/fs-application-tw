import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./pages/Root";
import ManageContent from "./pages/ManageContent";
import SettingsContent from "./components/SettingsContent";
import DataContextProvider from "./data/data-context";
import Spaces from "./pages/Spaces";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: ":id", element: <Home /> },
        { path: "manage", element: <ManageContent /> },
        { path: "settings", element: <SettingsContent /> },
      ],
    },
    {
      path: "room/:id",
      element: <Spaces />,
    },
  ]);

  return (
    <DataContextProvider>
      <RouterProvider router={router} />
    </DataContextProvider>
  );
}

export default App;
