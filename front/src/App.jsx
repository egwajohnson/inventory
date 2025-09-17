import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import Login from "./login";
import AppLayout from "./Layout/AppLout";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <AppLayout> */}
      <RouterProvider router={router} />
      {/* </AppLayout> */}
    </>
  );
}

export default App;
