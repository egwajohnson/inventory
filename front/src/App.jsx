import { RouterProvider } from "react-router-dom";
// import Dashboard from "./module/dashboard/dashboard";
// import Login from "./login";
// import Unauthorized from "./Layout/components/unauthorized/unauthorized";
import router from "./router";
import "./js/bootstrap.bundle.min.js";
// import "./js/bootstrap.bundle.js";
import "./App.css";
import "./css/index.css";
import "./css/bootstrap.css";
import "./css/bootstrap-grid.css";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
