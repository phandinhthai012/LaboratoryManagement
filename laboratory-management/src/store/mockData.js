// Mock data for different user roles - Updated to match backend response format

// LAB_MANAGER role user
const labManagerUserData = {
    userId: "b1a2c3d4-e5f6-7890-1234-56789abcdef0",
    username: "admin01",
    role: "LAB_MANAGER",
    privileges: [],
    accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiTEFCX01BTkFHRVIiLCJ1bmFtZSI6ImFkbWluMDEiLCJ0eXAiOiJhY2Nlc3MiLCJzdWIiOiJiMWEyYzNkNC1lNWY2LTc4OTAtMTIzNC01Njc4OWFiY2RlZjAiLCJpc3MiOiJpYW0tc2VydmljZSIsImF1ZCI6ImFsbC1zZXJ2aWNlcyIsImp0aSI6IjFjZTA0YWNiLWVkNGEtNDVmNC1iNTAzLTY1ZDlmZThkMDE0MyIsImlhdCI6MTc1OTgyODgzNSwiZXhwIjoxNzU5ODMyNDM1fQ.example_access_token_lab_manager",
    refreshToken: "eyJhbGciOiJIUzI1NiJ9.eyJ1bmFtZSI6ImFkbWluMDEiLCJ0eXAiOiJyZWZyZXNoIiwic3ViIjoiYjFhMmMzZDQtZTVmNi03ODkwLTEyMzQtNTY3ODlhYmNkZWYwIiwiaXNzIjoiaWFtLXNlcnZpY2UiLCJhdWQiOiJpYW0tc2VydmljZSIsImp0aSI6ImFmMjNkZmEyLTMwYzUtNDI3ZC1hODY1LTBmNTk5MjdjMWM4NCIsImlhdCI6MTc1OTgyODgzNSwiZXhwIjoxNzU5OTE1MjM1fQ.example_refresh_token_lab_manager",
    password: "admin123"
};

// ROLE_USER role user  
const roleUserData = {
    userId: "c2b3d4e5-f6g7-8901-2345-6789abcdef01",
    username: "labuser01",
    role: "ROLE_USER",
    privileges: [],
    accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9VU0VSIiwidW5hbWUiOiJsYWJ1c2VyMDEiLCJ0eXAiOiJhY2Nlc3MiLCJzdWIiOiJjMmIzZDRlNS1mNmc3LTg5MDEtMjM0NS02Nzg5YWJjZGVmMDEiLCJpc3MiOiJpYW0tc2VydmljZSIsImF1ZCI6ImFsbC1zZXJ2aWNlcyIsImp0aSI6IjFjZTA0YWNiLWVkNGEtNDVmNC1iNTAzLTY1ZDlmZThkMDE0MyIsImlhdCI6MTc1OTgyODgzNSwiZXhwIjoxNzU5ODMyNDM1fQ.example_access_token_role_user",
    refreshToken: "eyJhbGciOiJIUzI1NiJ9.eyJ1bmFtZSI6ImxhYnVzZXIwMSIsInR5cCI6InJlZnJlc2giLCJzdWIiOiJjMmIzZDRlNS1mNmc3LTg5MDEtMjM0NS02Nzg5YWJjZGVmMDEiLCJpc3MiOiJpYW0tc2VydmljZSIsImF1ZCI6ImlhbS1zZXJ2aWNlIiwianRpIjoiYWYyM2RmYTItMzBjNS00MjdkLWE4NjUtMGY1OTkyN2MxYzg0IiwiaWF0IjoxNzU5ODI4ODM1LCJleHAiOjE3NTk5MTUyMzV9.example_refresh_token_role_user",
    password: "labuser123"
};

// ROLE_ADMIN role user
const roleAdminUserData = {
    userId: "21b2443e-2cde-4dcb-ac96-37c61f884f59",
    username: "testUser",
    role: "ROLE_ADMIN",
    privileges: [],
    accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiIsInVuYW1lIjoidGVzdFVzZXIiLCJ0eXAiOiJhY2Nlc3MiLCJzdWIiOiIyMWIyNDQzZS0yY2RlLTRkY2ItYWM5Ni0zN2M2MWY4ODRmNTkiLCJpc3MiOiJpYW0tc2VydmljZSIsImF1ZCI6ImFsbC1zZXJ2aWNlcyIsImp0aSI6IjFjZTA0YWNiLWVkNGEtNDVmNC1iNTAzLTY1ZDlmZThkMDE0MyIsImlhdCI6MTc1OTgyODgzNSwiZXhwIjoxNzU5ODMyNDM1fQ.MzluDnlZdWw6CkuLMc4nfYjx2wgmYZ4OINh9XqNLhOA",
    refreshToken: "eyJhbGciOiJIUzI1NiJ9.eyJ1bmFtZSI6InRlc3RVc2VyIiwidHlwIjoicmVmcmVzaCIsInN1YiI6IjIxYjI0NDNlLTJjZGUtNGRjYi1hYzk2LTM3YzYxZjg4NGY1OSIsImlzcyI6ImlhbS1zZXJ2aWNlIiwiYXVkIjoiaWFtLXNlcnZpY2UiLCJqdGkiOiJhZjIzZGZhMi0zMGM1LTQyN2QtYTg2NS0wZjU5OTI3YzFjODQiLCJpYXQiOjE3NTk4Mjg4MzUsImV4cCI6MTc1OTkxNTIzNX0.e9S2F1GMbgPhz2wgga8UawI8Uwep06-G6NyDRYof1tE",
    password: "admin123"
};

// VIEWER role user
const viewerUserData = {
    userId: "e4d5f6g7-h8i9-0123-4567-89abcdef0123",
    username: "viewer01",
    role: "VIEWER",
    privileges: [],
    accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVklFV0VSIiwidW5hbWUiOiJ2aWV3ZXIwMSIsInR5cCI6ImFjY2VzcyIsInN1YiI6ImU0ZDVmNmc3LWg4aTktMDEyMy00NTY3LTg5YWJjZGVmMDEyMyIsImlzcyI6ImlhbS1zZXJ2aWNlIiwiYXVkIjoiYWxsLXNlcnZpY2VzIiwianRpIjoiMWNlMDRhY2ItZWQ0YS00NWY0LWI1MDMtNjVkOWZlOGQwMTQzIiwiaWF0IjoxNzU5ODI4ODM1LCJleHAiOjE3NTk4MzI0MzV9.example_access_token_viewer",
    refreshToken: "eyJhbGciOiJIUzI1NiJ9.eyJ1bmFtZSI6InZpZXdlcjAxIiwidHlwIjoicmVmcmVzaCIsInN1YiI6ImU0ZDVmNmc3LWg4aTktMDEyMy00NTY3LTg5YWJjZGVmMDEyMyIsImlzcyI6ImlhbS1zZXJ2aWNlIiwiYXVkIjoiaWFtLXNlcnZpY2UiLCJqdGkiOiJhZjIzZGZhMi0zMGM1LTQyN2QtYTg2NS0wZjU5OTI3YzFjODQiLCJpYXQiOjE3NTk4Mjg4MzUsImV4cCI6MTc1OTkxNTIzNX0.example_refresh_token_viewer",
    password: "viewer123"
};

// WATCHER role user
const watcherUserData = {
    userId: "f5e6g7h8-i9j0-1234-5678-9abcdef01234",
    username: "watcher01",
    role: "WATCHER",
    privileges: [],
    accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiV0FUQ0hFUiIsInVuYW1lIjoid2F0Y2hlcjAxIiwidHlwIjoiYWNjZXNzIiwic3ViIjoiZjVlNmc3aDgtaTlqMC0xMjM0LTU2NzgtOWFiY2RlZjAxMjM0IiwiaXNzIjoiaWFtLXNlcnZpY2UiLCJhdWQiOiJhbGwtc2VydmljZXMiLCJqdGkiOiIxY2UwNGFjYi1lZDRhLTQ1ZjQtYjUwMy02NWQ5ZmU4ZDAxNDMiLCJpYXQiOjE3NTk4Mjg4MzUsImV4cCI6MTc1OTgzMjQzNX0.example_access_token_watcher",
    refreshToken: "eyJhbGciOiJIUzI1NiJ9.eyJ1bmFtZSI6IndhdGNoZXIwMSIsInR5cCI6InJlZnJlc2giLCJzdWIiOiJmNWU2ZzdoOC1pOWowLTEyMzQtNTY3OC05YWJjZGVmMDEyMzQiLCJpc3MiOiJpYW0tc2VydmljZSIsImF1ZCI6ImlhbS1zZXJ2aWNlIiwianRpIjoiYWYyM2RmYTItMzBjNS00MjdkLWE4NjUtMGY1OTkyN2MxYzg0IiwiaWF0IjoxNzU5ODI4ODM1LCJleHAiOjE3NTk5MTUyMzV9.example_refresh_token_watcher",
    password: "watcher123"
};

// GUEST role user (additional role)
const guestUserData = {
    userId: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
    username: "guest01",
    role: "GUEST",
    privileges: [],
    accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiR1VFU1QiLCJ1bmFtZSI6Imd1ZXN0MDEiLCJ0eXAiOiJhY2Nlc3MiLCJzdWIiOiJhMWIyYzNkNC1lNWY2LTc4OTAtMTIzNC01Njc4OWFiY2RlZjAiLCJpc3MiOiJpYW0tc2VydmljZSIsImF1ZCI6ImFsbC1zZXJ2aWNlcyIsImp0aSI6IjFjZTA0YWNiLWVkNGEtNDVmNC1iNTAzLTY1ZDlmZThkMDE0MyIsImlhdCI6MTc1OTgyODgzNSwiZXhwIjoxNzU5ODMyNDM1fQ.example_access_token_guest",
    refreshToken: "eyJhbGciOiJIUzI1NiJ9.eyJ1bmFtZSI6Imd1ZXN0MDEiLCJ0eXAiOiJyZWZyZXNoIiwic3ViIjoiYTFiMmMzZDQtZTVmNi03ODkwLTEyMzQtNTY3ODlhYmNkZWYwIiwiaXNzIjoiaWFtLXNlcnZpY2UiLCJhdWQiOiJpYW0tc2VydmljZSIsImp0aSI6ImFmMjNkZmEyLTMwYzUtNDI3ZC1hODY1LTBmNTk5MjdjMWM4NCIsImlhdCI6MTc1OTgyODgzNSwiZXhwIjoxNzU5OTE1MjM1fQ.example_refresh_token_guest",
    password: "guest123"
};

// Array containing all users for easy access - updated with new structure
const allUsersData = [
    labManagerUserData,
    roleUserData,
    roleAdminUserData,
    viewerUserData,
    watcherUserData,
    guestUserData
];

// Export mock data for different roles - matching backend response format
export const mockUsers = {
    LAB_MANAGER: labManagerUserData,
    ROLE_USER: roleUserData,
    ROLE_ADMIN: roleAdminUserData,
    VIEWER: viewerUserData,
    WATCHER: watcherUserData,
    GUEST: guestUserData
};

// Export individual user data
export {
    labManagerUserData,
    roleUserData,
    roleAdminUserData,
    viewerUserData,
    watcherUserData,
    guestUserData,
    allUsersData
};

// Helper function to get user by role
export const getUserByRole = (role) => {
    return mockUsers[role] || null;
};

// Default export for convenience
export default mockUsers;




export const fallbackProvinces = [
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
    { value: 'Hải Phòng', label: 'Hải Phòng' },
    { value: 'Cần Thơ', label: 'Cần Thơ' },
    { value: 'An Giang', label: 'An Giang' },
    { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' },
    { value: 'Bắc Giang', label: 'Bắc Giang' },
    { value: 'Bắc Kạn', label: 'Bắc Kạn' },
    { value: 'Bạc Liêu', label: 'Bạc Liêu' },
    { value: 'Bắc Ninh', label: 'Bắc Ninh' },
    { value: 'Bến Tre', label: 'Bến Tre' },
    { value: 'Bình Định', label: 'Bình Định' },
    { value: 'Bình Dương', label: 'Bình Dương' },
    { value: 'Bình Phước', label: 'Bình Phước' },
    { value: 'Bình Thuận', label: 'Bình Thuận' },
    { value: 'Cà Mau', label: 'Cà Mau' },
    { value: 'Cao Bằng', label: 'Cao Bằng' },
    { value: 'Đắk Lắk', label: 'Đắk Lắk' },
    { value: 'Đắk Nông', label: 'Đắk Nông' },
    { value: 'Điện Biên', label: 'Điện Biên' },
    { value: 'Đồng Nai', label: 'Đồng Nai' },
    { value: 'Đồng Tháp', label: 'Đồng Tháp' },
    { value: 'Gia Lai', label: 'Gia Lai' },
    { value: 'Hà Giang', label: 'Hà Giang' },
    { value: 'Hà Nam', label: 'Hà Nam' },
    { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
    { value: 'Hải Dương', label: 'Hải Dương' },
    { value: 'Hậu Giang', label: 'Hậu Giang' },
    { value: 'Hòa Bình', label: 'Hòa Bình' },
    { value: 'Hưng Yên', label: 'Hưng Yên' },
    { value: 'Khánh Hòa', label: 'Khánh Hòa' },
    { value: 'Kiên Giang', label: 'Kiên Giang' },
    { value: 'Kon Tum', label: 'Kon Tum' },
    { value: 'Lai Châu', label: 'Lai Châu' },
    { value: 'Lâm Đồng', label: 'Lâm Đồng' },
    { value: 'Lạng Sơn', label: 'Lạng Sơn' },
    { value: 'Lào Cai', label: 'Lào Cai' },
    { value: 'Long An', label: 'Long An' },
    { value: 'Nam Định', label: 'Nam Định' },
    { value: 'Nghệ An', label: 'Nghệ An' },
    { value: 'Ninh Bình', label: 'Ninh Bình' },
    { value: 'Ninh Thuận', label: 'Ninh Thuận' },
    { value: 'Phú Thọ', label: 'Phú Thọ' },
    { value: 'Phú Yên', label: 'Phú Yên' },
    { value: 'Quảng Bình', label: 'Quảng Bình' },
    { value: 'Quảng Nam', label: 'Quảng Nam' },
    { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
    { value: 'Quảng Ninh', label: 'Quảng Ninh' },
    { value: 'Quảng Trị', label: 'Quảng Trị' },
    { value: 'Sóc Trăng', label: 'Sóc Trăng' },
    { value: 'Sơn La', label: 'Sơn La' },
    { value: 'Tây Ninh', label: 'Tây Ninh' },
    { value: 'Thái Bình', label: 'Thái Bình' },
    { value: 'Thái Nguyên', label: 'Thái Nguyên' },
    { value: 'Thanh Hóa', label: 'Thanh Hóa' },
    { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
    { value: 'Tiền Giang', label: 'Tiền Giang' },
    { value: 'Trà Vinh', label: 'Trà Vinh' },
    { value: 'Tuyên Quang', label: 'Tuyên Quang' },
    { value: 'Vĩnh Long', label: 'Vĩnh Long' },
    { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
    { value: 'Yên Bái', label: 'Yên Bái' }
]
