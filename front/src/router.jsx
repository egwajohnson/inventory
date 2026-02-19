import { createBrowserRouter } from "react-router-dom";
import Login from "./login";
import Dashboard from "./module/dashboard/dashboard";
import AppLayout from "./Layout/AppLout";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
]);

export default router;
