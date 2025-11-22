import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roleService from '../services/roleService';

const querykeys = {
    roleDetails: (roleId) => ['role', roleId],
    listRoles: (params) => ['roles', params],
};


export const useRoleById = (roleId) => {
  return useQuery({
    queryKey: querykeys.roleDetails(roleId),
    queryFn: () => roleService.getRoleById(roleId),
  });
};

// Get list of roles with params (pagination, search, filter)
export const useRoles = (params = {}) => {
  return useQuery({
    queryKey: querykeys.listRoles(params),
    queryFn: () => roleService.getListRoles(params),
  });
};
