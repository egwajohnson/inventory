import { createBrowserRouter } from "react-router-dom";
import Login from "./login";
import Dashboard from "./module/dashboard/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

export default router;
 