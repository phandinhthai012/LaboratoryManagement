import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";

const userService = {
    // Fetch list of users
    getListUsers: async (params) => {
        try {
            // const {
            //     q,
            //     gender,
            //     minAge,
            //     maxAge,
            //     sortBy,
            //     sortDir,
            //     page,
            //     size
            // } = params;
            const response = await apiClient.get(API_ENDPOINTS.USERS.GET_LIST_USERS, { params });
            return response.data;
        } catch (error) {
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
    createUser: async (userData) => {
        try {
            const { username, email, phone, fullName, gender, age, address, dateOfBirth, password, roleCode, identifyNumber } = userData;
            if(!username || !email || !phone || !fullName || !gender || !age || !address || !dateOfBirth || !password || !identifyNumber) {
                throw new Error("Missing required user data");
            }
            const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE_USER, {
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
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // get user by id
    getUserById: async (userId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USERS.GET_DETAIL_USER(userId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // update user
    updateUser: async (userId, userData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_USER(userId), userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // delete user
    deleteUser: async (userId) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE_USER(userId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // change password
    // "currentPassword": "P@ssw0rd123",
    // "newPassword": "AdminSet789",
    // "confirmNewPassword": "AdminSet789"
    changePassword: async (userId, passwordData) => {
        try {
            const { currentPassword, newPassword, confirmNewPassword } = passwordData;
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                throw new Error("Missing required password data");
            }
            const response = await apiClient.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD(userId), passwordData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // VERIFY_EMAIL: `${API_PREFIX}/iam/users/email/verify`,
    //     RESEND_EMAIL: `${API_PREFIX}/iam/users/email/resend`,
    verifyEmail: async (Data) => {
        try {
            const { userId, otp } = Data;
            if (!userId || !otp) {
                throw new Error("Missing required data");
            }
            const response = await apiClient.post(API_ENDPOINTS.USERS.VERIFY_EMAIL, Data);
            return response.data;
        } catch (error) {
            throw error;
        }           
    },
    resendEmail: async (Data) => {
        try {
            const { userId } = Data;
            if (!userId) {
                throw new Error("Missing required data");
            }
            const response = await apiClient.post(API_ENDPOINTS.USERS.RESEND_EMAIL, Data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // view user profile
    viewUserProfile: async (userId) => {
        try {
            if (!userId) {
                throw new Error("Missing userId");
            }
            const response = await apiClient.get(API_ENDPOINTS.USERS.VIEW_USER_PROFILE(userId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default userService;