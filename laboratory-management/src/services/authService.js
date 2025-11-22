import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";


const authService = {
    // Login user
    login: async (loginData) => {
        try {
            const {username, password} = loginData;
            if(!username || !password) {
                throw new Error("Missing required login data");
            }
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, loginData);
            return response.data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },
    // Logout user
    logout: async (refreshToken) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
            console.log("Logout response:", response.data);
            return response.data;
            
        } catch (error) {
            console.error('Logout Error:', error);
            throw error;
        }
    },
    // Logout all sessions
    logoutAll: async () => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);
            return response.data;
        }catch (error) {
            console.error('Logout All Error:', error);
            throw error;
        }
    },
    
    // Add separate method for getting user by ID (for admin)
    getUserById: async (userId) => {
        try {
            if (!userId) {
                throw new Error("UserId is required");
            }
            const response = await apiClient.get(API_ENDPOINTS.USERS.VIEW_USER_PROFILE(userId));
            return response.data;
        } catch (error) {
            console.error('Get User Profile Error:', error);
            throw error;
        }
    },
    // "username": "vinh1412",
    // "email": "vinh1412@example.com",
    // "phone": "+84901234567",
    // "fullName": "Trần Hiển Vinh",
    // "identifyNumber": "0123456789",
    // "gender": "MALE",
    // "age": 21,
    // "address": "Ho Chi Minh City",
    // "dateOfBirth": "12/12/2003",
    // "password": "{{hashedPassword}}",
    // "roleCode": "ROLE_USER"
    register: async (userData) => {
        try {
            const { username, email, phone, fullName, gender, age, address, dateOfBirth, password, roleCode, identifyNumber } = userData;
            if (!username || !email || !phone || !fullName || !gender || !age || !address || !dateOfBirth || !password || !identifyNumber) {
                throw new Error("Missing required user data");
            }

            const requestData = {
                username,
                email,
                phone,
                fullName,
                gender,
                age,
                identifyNumber,
                address,
                dateOfBirth,
                password,
                roleCode: roleCode || 'ROLE_USER' // Default to 'ROLE_USER' if not provided
            };
            
            const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE_USER, requestData);
            return response.data;
        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    },
    // Forgot password
    forgotPassword: async (email) => {
        try {
            if (!email) {
                throw new Error("Email is required");
            }
            const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            console.log("Forgot Password response:", response.data);
            return response.data;
        } catch (error) {
            console.error('Forgot Password Error:', error);
            throw error;
        }
    },
    resetPassword: async (token, newPassword, confirmPassword) => {
        try {
            if (!token || !newPassword || !confirmPassword) {
                throw new Error("Missing required data for password reset");
            }
            const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword, confirmPassword });
            console.log("Reset Password response:", response.data);
            return response.data;
        } catch (error) {
            console.error('Reset Password Error:', error);
            throw error;
        }
    },
    validateResetToken: async (token) => {
        try {
            if (!token) {
                throw new Error("Token is required");
            }
            // http://localhost:8080/api/v1/iam/auth/password/308e3e711e36494cb3bccff0cbe41e96
            const response = await apiClient.get(API_ENDPOINTS.AUTH.VALIDATE_TOKEN(token));
            return response.data;
        } catch (error) {
            console.error('Validate Reset Token Error:', error);
            throw error;
        }
    }
};

export default authService;