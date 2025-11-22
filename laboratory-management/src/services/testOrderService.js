import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";

const testOrderService = {
    // 01. Create Patient Test Order
    // "medicalRecordCode": "MRC-251015211926-F5EEEB-880"
    createTestOrder: async(data) => {
        try {
            if(!data.medicalRecordCode) {
                throw new Error("Missing required field: medicalRecordCode");
            }
            const response = await apiClient.post(API_ENDPOINTS.TESTORDER.CREATE_TEST_ORDER, {
                medicalRecordCode: data.medicalRecordCode
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // view Test Order
    viewTestOrder: async(testOrderId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.VIEW_DETAIL_TEST_ORDER(testOrderId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // delete
    deleteTestOrder: async(testOrderId) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.TESTORDER.DELETE_TEST_ORDER(testOrderId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // VIEW_TEST_ORDER_ITEM
    viewTestOrderItem: async(testOrderId, itemId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.VIEW_TEST_ORDER_ITEM(testOrderId, itemId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // PRINT_TEST_RESULTS
    // "customFileName": "bao thong",
    // "customSavePath": "D:\\MyNewFolder\\Reports"
    printTestResults: async(testOrderId, data) => {
        try {
            const { customFileName } = data;
            if(!customFileName ) {
                throw new Error("Missing required fields: customFileName or customSavePath");
            }
            const response = await apiClient.post(API_ENDPOINTS.TESTORDER.PRINT_TEST_RESULTS(testOrderId), {
                customFileName,

            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // ADD_TEST_ORDER_ITEM
    addTestOrderItem: async(data) => {
        try {
             const { testOrderId, testName } = data;
            const response = await apiClient.post(API_ENDPOINTS.TESTORDER.ADD_TEST_ORDER_ITEM(testOrderId), {
                testName: testName
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
//     {
//     "status": "PENDING",
//     "reviewStatus": "NONE",
//     "reviewMode": "HUMAN"
// }
    // UPDATE_TEST_ORDER_BY_CODE
    updateTestOrderByCode: async(testOrderCode, updatedData) => {
        try {
            const { status, reviewStatus, reviewMode } = updatedData;

            const response = await apiClient.put(API_ENDPOINTS.TESTORDER.UPDATE_TEST_ORDER_BY_CODE(testOrderCode), {
                status: status,
                reviewStatus: reviewStatus,
                reviewMode: reviewMode
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // GET_ALL_TEST_ORDERS
    getAllTestOrders: async(queryParams) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.GET_ALL_TEST_ORDERS, { params: queryParams });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // UPDATE_TEST_ORDER_ITEM
    updateTestOrderItem: async(testOrderId, itemId, updatedData) => {
        try {
            const { testName, status } = updatedData;
            const response = await apiClient.put(API_ENDPOINTS.TESTORDER.UPDATE_TEST_ORDER_ITEM(testOrderId, itemId), {
                testName: testName,
                status: status,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // GET_ALL_TEST_CATALOGS
    getAllTestCatalogs: async() => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.GET_ALL_TEST_CATALOGS);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // comments related APIs
    createComment: async(data) => {
        try {
            const {
                targetId,
                targetType,
                content
            }= data;
            if(!targetId || !targetType || !content) {
                throw new Error("Missing required fields: targetId, targetType, or content");
            }
            const response = await apiClient.post(API_ENDPOINTS.COMMENTS.CREATE_COMMENT, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // MODIFY_COMMENT
    modifyComment: async(commentId, updatedData) => {
        try {
            const {
                newContent
            } = updatedData;
            if(!newContent) {
                throw new Error("Missing required field: newContent");
            }
            const response = await apiClient.put(API_ENDPOINTS.COMMENTS.MODIFY_COMMENT(commentId), updatedData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // DELETE_COMMENT
    deleteComment: async(commentId) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COMMENTS.DELETE_COMMENT(commentId),{
                deleteReason: "Inappropriate content"
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // REPLY_COMMENT
    replyComment: async(commentId, replyData) => {
        try {
            const {content} = replyData;
            if(!content) {
                throw new Error("Missing required field: content");
            }
            const response = await apiClient.post(API_ENDPOINTS.COMMENTS.REPLY_COMMENT(commentId), replyData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // sendOrderToInstrument
    sendOrderToInstrument: async(testOrderId) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.TESTORDER.SEND_ORDER_TO_INSTRUMENT(testOrderId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // getReportJobStatus
    getReportJobStatus: async(jobId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.GET_REPORT_JOB_STATUS(jobId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}

export default testOrderService;