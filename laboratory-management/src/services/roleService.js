import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";

const roleService = {
    // Fetch list of roles
    getListRoles: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ROLES.GET_LIST_ROLES);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // Create a new role
//   "roleName": "Watcher",
//   "roleCode": "Watcher",
//   "roleDescription": "Can Watch anything",
//   "privilegeCodes": ["USER_VIEW"]
    createRole: async (roleData) => {
        try {
            const { roleName, roleCode, roleDescription, privilegeCodes } = roleData;
            if (!roleName || !roleCode || !roleDescription || !privilegeCodes) {
                throw new Error("Missing required role data");
            }
            const response = await apiClient.post(API_ENDPOINTS.ROLES.CREATE_ROLE, {
                roleName,
                roleCode,
                roleDescription,
                privilegeCodes
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // Update an existing role
//       "roleName": "Viewer",
//   "roleDescription": "Can view",
//   "privilegeCodes": ["USER_VIEW"]
    updateRole: async (roleId, roleData) => {
        try {
            if (!roleId) {
                throw new Error("RoleId is required");
            }
            const { roleName, roleDescription, privilegeCodes } = roleData;
            if (!roleName || !roleDescription || !privilegeCodes) {
                throw new Error("Missing required role data");
            }
            const response = await apiClient.put(API_ENDPOINTS.ROLES.UPDATE_ROLE(roleId), {
                roleName,
                roleDescription,
                privilegeCodes
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // Delete a role
    deleteRole: async (roleId) => {
        try {
            if (!roleId) {
                throw new Error("RoleId is required");
            }
            const response = await apiClient.delete(API_ENDPOINTS.ROLES.DELETE_ROLE(roleId));
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default roleService;