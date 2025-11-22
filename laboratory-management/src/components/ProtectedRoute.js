import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const defaultRoles = ['ROLE_ADMIN', 'LAB_MANAGER', 'VIEWER', 'WATCHER', 'ROLE_USER', 'GUEST'];
  if (!allowedRoles) {
    allowedRoles = defaultRoles;
  }
  
  

  const { isAuthenticated,user } = useAuth();
  // console.log("Allowed Roles:", user);
  // return isAuthenticated ? children : <Navigate to="/login" replace />;
  if(!isAuthenticated) return <Navigate to="/login" replace />;
  if(!user || !allowedRoles.includes(user.roleCode)) return <Navigate to="/unauthorized" replace />;
  return children;

};

export default ProtectedRoute;