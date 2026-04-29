import { createBrowserRouter } from "react-router-dom";
import Login from "./login";
import PreRegister from "./module/preRegister/preRegister";
import Register from "./module/register/register";
import Dashboard from "./module/dashboard/dashboard";
import AppLayout from "./Layout/AppLout";
import Error from "./Layout/components/error/error";
import Cart from "./module/cartItems/cart";
import ForgotPassword from "./Layout/components/forgotPassword/forgotPassword";
import RequestOtp from "./Layout/components/requestOtp/requestOtp";
import Create from "./module/createProduct";
import Products from "./module/getProduct/product";
import Logout from "./logout/logout";
import ProtectedRoute from "./module/ProtectedRoute/protectedRouter";
import Unauthorized from "./Layout/components/unauthorized/unauthorized";
import Booking from "./module/bookings/booking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Logout",
    element: <Logout />,
  },
  {
    path: "/ForgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/RequestOtp",
    element: <RequestOtp />,
  },
  {
    path: "/Booking",
    element: (
      <ProtectedRoute allowedRoles={["Admin", "user"]}>
        <Booking />
      </ProtectedRoute>
    ),
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "user"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/create",
        element: <Create />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/Cart",
        element: <Cart />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/products",
        element: (
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <Products />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/preRegister",
    element: <PreRegister />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);

export default router;
