import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full space-y-8">
        {children}
      </div>
    </div>
  );
};


export default AuthLayout;