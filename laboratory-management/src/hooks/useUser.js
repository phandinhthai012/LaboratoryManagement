import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import { useNotifier } from '../contexts/NotifierContext';
// Get current user (getMe)

const querykeys = {
  userDetails: (userId) => ['user', userId],
  listUsers: (params) => ['users', params],
};

export const useUserById = (userId) => {
  return useQuery({
    queryKey: querykeys.userDetails(userId),
    queryFn: async () => {
      const response = await userService.getUserById(userId);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Fetched user data:', data);
    },
    enabled: !!userId && !!localStorage.getItem('accessToken'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get list of users with params (pagination, search, filter)
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: querykeys.listUsers(params),
    queryFn: () => userService.getListUsers(params),
    enabled: !!localStorage.getItem('accessToken'),
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data when params change
  });
};


export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotifier();

  return useMutation({
    mutationFn: (userData) => userService.createUser(userData),
    onSuccess: () => {
      showNotification('User created successfully');
      // Với create, invalidate là cách đơn giản và an toàn nhất
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      const message = error.response?.data?.message || 'Failed to create user';
      showNotification(message, 'error');
    },
  });
};


export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotifier();
  return useMutation({
    mutationFn: ({ userId, userData }) => userService.updateUser(userId, userData),
    onSuccess: (updatedUser, userId) => {
      showNotification('Cập nhật thông tin thành công!', 'success');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries(querykeys.userDetails(userId));
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      const message = error.response?.data?.message || 'Failed to update user';
      showNotification(message, 'error');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotifier();

  return useMutation({
    mutationFn: async (userId) => {
      return await userService.deleteUser(userId);
    },
    onSuccess: (response, userId) => {
      // queryClient.invalidateQueries(querykeys.userDetails(null));
      // queryClient.invalidateQueries(querykeys.listUsers()); // fetch lại toàn bộ
      // queryClient.setQueryData(querykeys.listUsers({}), (oldData) => { // tối ưu, chỉ xoá trong cache
      //   return {
      //     ...oldData,
      //     data: oldData.data.filter((user) => user.userId !== userId),
      //   };
      // });
      showNotification('User deleted successfully');
      queryClient.setQueriesData(
        { predicate: (query) => query.queryKey[0] === 'users' },
        (oldData) => {
          if (!oldData?.data?.content) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              content: oldData.data.content.filter((u) => u.userId !== userId),
            },
          };
        }
      );
      queryClient.removeQueries({ queryKey: ['user', userId] });

    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      const message = error.response?.data?.message || 'Failed to delete user';
      showNotification(message, 'error');
    },
  });
};

export const useAdminCreateUser = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotifier();
  return useMutation({
    mutationFn: (userData) => userService.adminCreateUser(userData),
    onSuccess: () => {
      showNotification('Admin created user successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error admin creating user:', error);
      const message = error.response?.data?.message || 'Failed to admin create user';
      showNotification(message, 'error');
    },
  });
}