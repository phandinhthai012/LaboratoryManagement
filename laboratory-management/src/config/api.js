const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
    TIMEOUT: 60000,
    HEADERS: {
        'Content-Type': 'application/json',
    }
}
export const API_PREFIX = '/api/v1';
const api_patient ='patient-medical-records';
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_PREFIX}/iam/auth/login`,
        CREATE_USER: `${API_PREFIX}/iam/users`,
        REFRESH_TOKEN: `${API_PREFIX}/iam/auth/refresh-token`,
        FORGOT_PASSWORD: `${API_PREFIX}/iam/auth/forgot-password`,
        VALIDATE_TOKEN: (token) => `${API_PREFIX}/iam/auth/password/${token}`,
        RESET_PASSWORD: `${API_PREFIX}/iam/auth/reset-password`,
        LOGOUT: `${API_PREFIX}/iam/auth/logout`,
        LOGOUT_ALL: `${API_PREFIX}/iam/auth/logout/all`,
        LISTROLES: `${API_PREFIX}/iam/roles`,
    },
    USERS: {
        CREATE_USER: `${API_PREFIX}/iam/users`,
        UPDATE_USER: (userId) => `${API_PREFIX}/iam/users/${userId}`,
        GET_DETAIL_USER: (userId) => `${API_PREFIX}/iam/users/${userId}`,
        VERIFY_EMAIL: `${API_PREFIX}/iam/users/email/verify`,
        RESEND_EMAIL: `${API_PREFIX}/iam/users/email/resend`,
        GET_LIST_USERS: `${API_PREFIX}/iam/users`,
        DELETE_USER: (userId) => `${API_PREFIX}/iam/users/${userId}`,
        VIEW_USER_PROFILE: (UserId) => `${API_PREFIX}/iam/users/${UserId}`,
        CHANGE_PASSWORD: (userId) => `${API_PREFIX}/iam/users/${userId}/password`,
    },
    ROLES: {
        GET_LIST_ROLES: `${API_PREFIX}/iam/roles`,
        CREATE_ROLE: `${API_PREFIX}/iam/roles`,
        UPDATE_ROLE: (roleId) => `${API_PREFIX}/iam/roles/${roleId}`,
        DELETE_ROLE: (roleId) => `${API_PREFIX}/iam/roles/${roleId}`,
    },
    PATIENTS: {
        CREATE_PATIENT_MEDICAL_RECORD: `${API_PREFIX}/${api_patient}`,
        UPDATE_PATIENT_MEDICAL_RECORD: (recordId) => `${API_PREFIX}/${api_patient}/${recordId}`,
        DELETE_PATIENT_MEDICAL_RECORD: (recordId) => `${API_PREFIX}/${api_patient}/${recordId}`,
        GET_ALL_PATIENT_MEDICAL_RECORDS: `${API_PREFIX}/${api_patient}`,
        GET_PATIENT_BY_ID: (patientId) => `${API_PREFIX}/${api_patient}/${patientId}`,
        GET_PATIENT_BY_CODE: (patientCode) => `${API_PREFIX}/${api_patient}/code/${patientCode}`,
    },
    TESTORDER: {
        CREATE_TEST_ORDER: `${API_PREFIX}/test-orders`,
        // 02. View Detail Patient’s Test Order
        VIEW_DETAIL_TEST_ORDER: (orderId) => `${API_PREFIX}/test-orders/${orderId}`,
        // 03. Delete Patient Test Order
        DELETE_TEST_ORDER: (orderId) => `${API_PREFIX}/test-orders/${orderId}`,
        // 05. View 1 TestOrderItem của 1 TestOrder
        VIEW_TEST_ORDER_ITEM: (orderId, itemId) => `${API_PREFIX}/test-orders/${orderId}/items/${itemId}`,
        // 06. Print Test Results 
        PRINT_TEST_RESULTS: (orderId) => `${API_PREFIX}/test-orders/${orderId}/print`,
        //07. Export Excel (request tùy chỉnh, nếu ko có gì thì BE tạo theo giá trị mặc định)
        EXPORT_EXCEL: `${API_PREFIX}/test-orders/export-excel`,
        // 08. Review Test Order Results
        REVIEW_TEST_ORDER_RESULT: (orderCode) => `${API_PREFIX}/test-orders/${orderCode}/review`,
        // addTestOrderItem
        ADD_TEST_ORDER_ITEM: (orderId) => `${API_PREFIX}/test-orders/${orderId}/items`,
        // updateTestOrderByCode
        UPDATE_TEST_ORDER_BY_CODE: (orderCode) => `${API_PREFIX}/test-orders/${orderCode}`,
        // getAllTestOrders
        GET_ALL_TEST_ORDERS: `${API_PREFIX}/test-orders`,
        // updateTestOrderItem
        UPDATE_TEST_ORDER_ITEM: (orderId, itemId) => `${API_PREFIX}/test-orders/${orderId}/items/${itemId}`,
        // getAllTestCatalogs
        GET_ALL_TEST_CATALOGS: `${API_PREFIX}/test-catalog/all`,
        //sendOrderToInstrument
        SEND_ORDER_TO_INSTRUMENT: (orderId) => `${API_PREFIX}/hl7/${orderId}/request`,
        //http://localhost:8080/api/v1/report-jobs/7b2be1d4-5270-4d6e-85d2-ab6806bdb5b8
        GET_REPORT_JOB_STATUS: (jobId) => `${API_PREFIX}/report-jobs/${jobId}`,

    },
    COMMENTS : {
        CREATE_COMMENT: `${API_PREFIX}/order-comments`,
        MODIFY_COMMENT: (commentId) => `${API_PREFIX}/order-comments/${commentId}`,
        DELETE_COMMENT: (commentId) => `${API_PREFIX}/order-comments/${commentId}/delete`,
        REPLY_COMMENT: (commentId) => `${API_PREFIX}/order-comments/${commentId}/reply`,
    },
    // Warehouse service
    WAREHOUSE: {
        //Instrument Management
        // 01. Get All Instruments http://localhost:8080/api/v1/warehouse/instruments
        GET_ALL_INSTRUMENTS: `${API_PREFIX}/warehouse/instruments`,
        // 02. add 1 Instrument http://localhost:8080/api/v1/warehouse/instruments
        ADD_INSTRUMENT: `${API_PREFIX}/warehouse/instruments`,
        // 03. Create Configurations http://localhost:8080/api/v1/warehouse/configurations
        CREATE_CONFIGURATIONS: `${API_PREFIX}/warehouse/configurations`,
        //http://localhost:8080/api/v1/warehouse/instruments/status/check
        CHECK_INSTRUMENT_STATUS: `${API_PREFIX}/warehouse/instruments/status/check`,
        //http://localhost:8080/api/v1/warehouse/instruments/INS-251103114826-119b2164-5884/status
        GET_INSTRUMENT_STATUS: (instrumentCode) => `${API_PREFIX}/warehouse/instruments/${instrumentCode}/status`,
        // http://localhost:8080/api/v1/warehouse/instruments/activate
        ACTIVATE_INSTRUMENT: `${API_PREFIX}/warehouse/instruments/activate`,
        //http://localhost:8080/api/v1/warehouse/instruments/deactivate
        DEACTIVATE_INSTRUMENT: `${API_PREFIX}/warehouse/instruments/deactivate`,
        // Configuration Management
        //01 modify configuration http://localhost:8080/api/v1/warehouse/configurations/CFS-251103113517-05ee6f38-2018
        MODIFY_CONFIGURATION: (configCode) => `${API_PREFIX}/warehouse/configurations/${configCode}`,
        //http://localhost:8080/api/v1/warehouse/configurations?search=Password Policy&startDate=2025-09-12&endDate=2025-11-03
        GET_ALL_CONFIGURATIONS: `${API_PREFIX}/warehouse/configurations`,
        // http://localhost:8080/api/v1/warehouse/configurations/CFS-251103111530-de796b1a-7950
        GET_CONFIGURATION_BY_ID: (configCode) => `${API_PREFIX}/warehouse/configurations/${configCode}`,
        // ReceiveReagantHistoryForVendorSupply
        //http://localhost:8080/api/v1/warehouse/reagents/history/receive
        RECEIVE_REAGANT_HISTORY_FOR_VENDOR_SUPPLY: `${API_PREFIX}/warehouse/reagents/history/receive`,
        //getAllReagantHistoryForVendorSupply
        //http://localhost:8080/api/v1/warehouse/reagents/history/supply
        GET_ALL_REAGANT_HISTORY_FOR_VENDOR_SUPPLY: `${API_PREFIX}/warehouse/reagents/history/supply`,
        // /getReagantHistoryForVendorSupplyById
        // http://localhost:8080/api/v1/warehouse/reagents/history/supply/RSH-251030135442-85cb90d7-1876
        GET_REAGANT_HISTORY_FOR_VENDOR_SUPPLY_BY_ID: (historyCode) => `${API_PREFIX}/warehouse/reagents/history/supply/${historyCode}`,
        //http://localhost:8080/api/v1/warehouse/test-parameters?page=0&size=20&sort=paramName,asc&search=WBC
        GET_ALL_TEST_PARAMETERS: `${API_PREFIX}/warehouse/test-parameters`,
    },
}


export default API_CONFIG;
