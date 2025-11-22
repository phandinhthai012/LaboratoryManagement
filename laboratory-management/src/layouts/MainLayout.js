import React from "react";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-80 min-h-screen">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
