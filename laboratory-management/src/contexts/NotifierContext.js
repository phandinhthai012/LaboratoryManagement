import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// 1. Tạo Context
const NotifierContext = createContext();

// 2. Tạo Provider Component
export const NotifierProvider = ({ children }) => {
  // State để quản lý thông báo: open, message, severity (loại: success, error...)
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Hàm để hiển thị thông báo - các component khác sẽ gọi hàm này
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Hàm để đóng thông báo
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Giá trị mà Provider sẽ cung cấp cho các component con
  const value = { showNotification };

  return (
    <NotifierContext.Provider value={value}>
      {children}

      {/* Component Snackbar được đặt ở đây, một nơi duy nhất */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Có thể tùy chỉnh vị trí ở đây
      >
        <Alert 
          onClose={handleClose} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotifierContext.Provider>
  );
};

// 3. Tạo custom hook để sử dụng context một cách dễ dàng
export const useNotifier = () => {
  return useContext(NotifierContext);
};