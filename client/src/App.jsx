import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./js/bootstrap.bundle.min.js";
import "./App.css";
import "./css/index.css";
import "./css/bootstrap.css";
import "./css/bootstrap.min.css";
import "./css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
