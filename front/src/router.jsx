import { createBrowserRouter } from "react-router-dom";
import Login from "./login";
import Pre from "./module/pre/pre";
import Register from "./module/register/register";
import Dashboard from "./module/dashboard/dashboard";
import AppLayout from "./Layout/AppLout";
import Error from "./Layout/components/error/error";
import Cart from "./module/cart/cart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
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
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/Pre",
    element: <Pre />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);

export default router;
