import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./pages/Root";
import ManageContent from "./pages/ManageContent copy";
import SettingsContent from "./components/SettingsContent";
import DataContextProvider from "./data/data-context";
import Spaces from "./pages/Spaces";
import { Login } from "./pages/Login";
import { Toaster } from "./components/ui/toaster";
import { checkAuthLoader, checkAuthLoaderSpecial } from "./helper/auth";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      // loader: checkAuthLoader,
    },
    {
      path: "/home",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home />, loader: checkAuthLoader },
        { path: ":id", element: <Home />, loader: checkAuthLoader },
        {
          path: "manage",
          element: <ManageContent />,
          loader: checkAuthLoaderSpecial,
        },
        {
          path: "settings",
          element: <SettingsContent />,
          loader: checkAuthLoader,
        },
      ],
    },
    {
      path: "room/:id",
      element: <Spaces />,
      loader: checkAuthLoader,
    },
  ]);

  return (
    <DataContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </DataContextProvider>
  );
}

export default App;
