// Mock data for system configurations
export const mockSystemConfigs = [
  {
    id: 1,
    parameter: 'AUTO_BACKUP_ENABLED',
    value: 'true',
    description: 'Tự động sao lưu dữ liệu hệ thống',
    category: 'System',
    status: 'active'
  },
  {
    id: 2,
    parameter: 'SESSION_TIMEOUT',
    value: '30',
    description: 'Thời gian hết hạn phiên làm việc (phút)',
    category: 'Security',
    status: 'active'
  },
  {
    id: 3,
    parameter: 'MAX_FILE_SIZE',
    value: '10MB',
    description: 'Kích thước tệp tải lên tối đa',
    category: 'System',
    status: 'active'
  },
  {
    id: 4,
    parameter: 'PASSWORD_POLICY',
    value: 'complex',
    description: 'Chính sách mật khẩu phức tạp',
    category: 'Security',
    status: 'active'
  },
  {
    id: 5,
    parameter: 'EMAIL_NOTIFICATIONS',
    value: 'true',
    description: 'Gửi thông báo qua email',
    category: 'Notification',
    status: 'active'
  },
  {
    id: 6,
    parameter: 'BACKUP_RETENTION',
    value: '90',
    description: 'Thời gian lưu trữ bản sao lưu (ngày)',
    category: 'System',
    status: 'inactive'
  },
  {
    id: 7,
    parameter: 'LOGIN_ATTEMPTS',
    value: '5',
    description: 'Số lần đăng nhập sai tối đa',
    category: 'Security',
    status: 'active'
  },
  {
    id: 8,
    parameter: 'SMS_NOTIFICATIONS',
    value: 'false',
    description: 'Gửi thông báo qua SMS',
    category: 'Notification',
    status: 'inactive'
  }
];

// Mock data for test parameters
export const mockTestParameters = [
  {
    id: 1,
    parameter: 'White Blood Cell Count',
    abbreviation: 'WBC',
    normalRange: '4.0-11.0',
    unit: '10³/μL',
    category: 'Hematology'
  },
  {
    id: 2,
    parameter: 'Red Blood Cell Count',
    abbreviation: 'RBC',
    normalRange: '4.2-5.4 (M), 3.6-5.0 (F)',
    unit: '10⁶/μL',
    category: 'Hematology'
  },
  {
    id: 3,
    parameter: 'Hemoglobin',
    abbreviation: 'HGB',
    normalRange: '13.5-17.5 (M), 12.0-15.5 (F)',
    unit: 'g/dL',
    category: 'Hematology'
  },
  {
    id: 4,
    parameter: 'Hematocrit',
    abbreviation: 'HCT',
    normalRange: '41-53 (M), 36-46 (F)',
    unit: '%',
    category: 'Hematology'
  },
  {
    id: 5,
    parameter: 'Platelet Count',
    abbreviation: 'PLT',
    normalRange: '150-450',
    unit: '10³/μL',
    category: 'Hematology'
  },
  {
    id: 6,
    parameter: 'Glucose',
    abbreviation: 'GLU',
    normalRange: '70-100',
    unit: 'mg/dL',
    category: 'Chemistry'
  },
  {
    id: 7,
    parameter: 'Blood Urea Nitrogen',
    abbreviation: 'BUN',
    normalRange: '7-20',
    unit: 'mg/dL',
    category: 'Chemistry'
  },
  {
    id: 8,
    parameter: 'Creatinine',
    abbreviation: 'CREA',
    normalRange: '0.6-1.2',
    unit: 'mg/dL',
    category: 'Chemistry'
  },
  {
    id: 9,
    parameter: 'Alanine Aminotransferase',
    abbreviation: 'ALT',
    normalRange: '7-56',
    unit: 'U/L',
    category: 'Chemistry'
  },
  {
    id: 10,
    parameter: 'Aspartate Aminotransferase',
    abbreviation: 'AST',
    normalRange: '10-40',
    unit: 'U/L',
    category: 'Chemistry'
  }
];