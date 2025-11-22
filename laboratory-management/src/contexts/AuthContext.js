import React, { createContext, useContext, useState } from 'react';
import authService from '../services/authService';
const AuthContext = createContext();


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const userLocal = localStorage.getItem("userData")
    const [isAuthenticated, setIsAuthenticated] = useState(!!userLocal);
    const [user, setUser] = useState(userLocal ? JSON.parse(userLocal) : null);
    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        // Update localStorage as well
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');
        }
    };

    const logout = async () => {

        try {
            const result = await authService.logout(localStorage.getItem('refreshToken'));
            // Clear all auth-related localStorage items
            if (result.code === 200 || result.code === 204) {
                localStorage.removeItem('userData');
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setTimeout(() => {
                    setIsAuthenticated(false);
                    setUser(null);
                }, 2000);
            }
            return result;
        } catch (error) {
            console.error('Logout error', error);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('userData');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return null;
        }
    };
    const updateUser = (updatedUserData) => {
        const newUserData = {
            ...user,
            ...updatedUserData
        };

        setUser(newUserData);
        localStorage.setItem('userData', JSON.stringify(newUserData));

        return newUserData;
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};