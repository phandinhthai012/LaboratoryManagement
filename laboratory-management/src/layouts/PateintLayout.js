import React from "react";
import PatientSidebar from "../components/PatientSidebar";

const PatientLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PatientSidebar />
      <main className="md:ml-80 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;
