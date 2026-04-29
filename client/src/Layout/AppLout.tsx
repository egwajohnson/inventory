import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <div className="app-layout">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default AppLayout;
