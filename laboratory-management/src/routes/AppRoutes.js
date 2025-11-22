import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Auth/login';
import Register from '../pages/Auth/register';
import Dashboard from '../pages/admin/Home/dashboard';
import Patients from '../pages/admin/Patients/index';
import Tests from '../pages/admin/Tests/index';
import Services from '../pages/admin/Services/index';
import Devices from '../pages/admin/Devices/index';
import Users from '../pages/admin/Users/index';
import Reports from '../pages/admin/Reports/index';
import Profile from '../pages/admin/Profile/index';
import PatientDashboard from '../pages/Patient/Home/dasboard';
import PatientViewTests from '../pages/Patient/TestResult/index';
import PatientViewProfile from '../pages/Patient/Profile/index';
import VerifyEmail from '../pages/Auth/verifyEmail';
import ForgotPassword from '../pages/Auth/forgotPassword';
import TestOrderDetail from '../pages/admin/Tests/testOrderDetail';
import { useAuth } from '../contexts/AuthContext';
import ResetPassword from '../pages/Auth/resetPassword';
import Configurations from '../pages/admin/Configurations';

const AppRoutes = () => {
    const { user } = useAuth();
    return (

        <Routes>
            {/* Redirect root to role-specific dashboard */}
            <Route
                path="/"
                element={
                    user
                        ? user.roleCode === 'ROLE_USER'
                            ? <Navigate to="/normal-dashboard" replace />
                            : <Navigate to="/dashboard" replace />
                        : <Navigate to="/login" replace />
                }
            />

            {/* Public Routes */}
            {/* <Route path="/=" element={< landingpage/>} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/*Admin Routes for ROLE_ADMIN, LAB_MANAGER, VIEWER, WATCHER*/}
            <Route
                path="/dashboard"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'LAB_MANAGER', 'VIEWER', 'WATCHER']}>
                    <Dashboard />
                </ProtectedRoute>}
            />
            <Route
                path="/patients"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'LAB_MANAGER']}>
                    <Patients />
                </ProtectedRoute>}
            />
            <Route
                path="/tests"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'LAB_MANAGER']}>
                    <Tests />
                </ProtectedRoute>}
            />
            <Route
                path="/test-orders/:id"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'LAB_MANAGER']}>
                    <TestOrderDetail />
                </ProtectedRoute>}
            />
            <Route
                path="/services"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'VIEWER']}>
                    <Services /></ProtectedRoute>}
            />
            <Route
                path="/devices"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'VIEWER', 'LAB_MANAGER']}>
                    <Devices />
                </ProtectedRoute>}
            />
            <Route
                path="/configurations"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'LAB_MANAGER']}>
                    <Configurations />
                </ProtectedRoute>}
            />
            <Route
                path="/users"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <Users />
                </ProtectedRoute>}
            />
            <Route
                path="/reports"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'WATCHER']}>
                    <Reports />
                </ProtectedRoute>}
            />
            <Route
                path="/profile"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'LAB_MANAGER', 'VIEWER', 'WATCHER']}>
                    <Profile />
                </ProtectedRoute>}
            />
            {/*Normal User Routes for ROLE_USER*/}
            <Route
                path="/normal-dashboard"
                element={<ProtectedRoute allowedRoles={['ROLE_USER']}>
                    <PatientDashboard />
                </ProtectedRoute>}
            />
            <Route
                path='/normal-view-tests'
                element={<ProtectedRoute allowedRoles={['ROLE_USER']}>
                    <PatientViewTests />
                </ProtectedRoute>}
            />
            <Route
                path='/normal-view-profile'
                element={<ProtectedRoute allowedRoles={['ROLE_USER']}>
                    <PatientViewProfile />
                </ProtectedRoute>}
            />
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

    );
};

export default AppRoutes;