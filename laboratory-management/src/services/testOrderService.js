import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";

const testOrderService = {

    getAllTestOrders: async (params) => {
        try {
            console.log("Params in service:", params);
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.GET_ALL_TEST_ORDERS, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getTestOrderById: async (orderId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.GET_TEST_ORDER_BY_ID(orderId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createTestOrder: async (data) => {
        try {
            //             "medicalRecordCode": "MRC-251015211655-156851-688",
            //   "testTypeId": "TTID-251120092450-df5c48ab-2515"
            if (!data.medicalRecordCode) {
                throw new Error("Missing required field: medicalRecordCode");
            }
            if
                (!data.testTypeId) {
                throw new Error("Missing required field: testTypeId");
            }
            const response = await apiClient.post(API_ENDPOINTS.TESTORDER.CREATE_TEST_ORDER, {
                medicalRecordCode: data.medicalRecordCode,
                testTypeId: data.testTypeId
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createTestType: async (data) => {
        try {
            //             {
            //   "name": "Huyết học lần 3",
            //   "description": "Xét nghiệm công thức máu cao",
            //   "testParameterIds": [
            //     "TP-251117171840-c65455a6-1549",
            //     "TP-251117172119-805741b6-3765"
            //   ],
            //   "reagentName": "Lysing", 
            //   "requiredVolume": 50
            // }
            const {
                name,
                description,
                testParameterIds,
                reagentName,
                requiredVolume
            } = data;
            const response = await apiClient.post(API_ENDPOINTS.TESTORDER.CREATE_TEST_TYPE, {
                name: name,
                description: description,
                testParameterIds: testParameterIds,
                reagentName: reagentName,
                requiredVolume: requiredVolume
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAllTestTypes: async (params) => {
        try {
            if (!params) {
                params = {
                    size: 100,
                    page: 0
                };
            }
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.GET_ALL_TEST_TYPES, { params });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },
    viewTestOrder: async (testOrderId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.VIEW_DETAIL_TEST_ORDER(testOrderId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteTestOrder: async (testOrderId) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.TESTORDER.DELETE_TEST_ORDER(testOrderId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    viewTestOrderItem: async (testOrderId, itemId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.VIEW_TEST_ORDER_ITEM(testOrderId, itemId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    printTestResults: async (testOrderId, data) => {
        try {
            const { customFileName } = data;
            if (!customFileName) {
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
    exportExcelTestOrders: async (data) => {
        if (!data.customFileName) {
            const now = new Date();
            const timestamp = now.toISOString().replace(/[-:.]/g, '').slice(0, 15);
            data.customFileName = `TestOrders_${timestamp}`;
        }
        if(!data.dateRangeType){
            data.dateRangeType = 'CUSTOM';
        }
        try {
            const response = await apiClient.post(API_ENDPOINTS.TESTORDER.EXPORT_EXCEL, {
                dateRangeType: data.dateRangeType,
                startDate: data.startDate,
                endDate: data.endDate,
                customFileName: data.customFileName
            }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addTestOrderItem: async (data) => {
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
    updateTestOrderByCode: async (testOrderCode, updatedData) => {
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
    updateTestOrderItem: async (testOrderId, itemId, updatedData) => {
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
    getAllTestCatalogs: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.GET_ALL_TEST_CATALOGS);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createComment: async (data) => {
        try {
            const {
                targetId,
                targetType,
                content
            } = data;
            if (!targetId || !targetType || !content) {
                throw new Error("Missing required fields: targetId, targetType, or content");
            }
            const response = await apiClient.post(API_ENDPOINTS.COMMENTS.CREATE_COMMENT, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    modifyComment: async (commentId, updatedData) => {
        try {
            const {
                newContent
            } = updatedData;
            if (!newContent) {
                throw new Error("Missing required field: newContent");
            }
            const response = await apiClient.put(API_ENDPOINTS.COMMENTS.MODIFY_COMMENT(commentId), updatedData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteComment: async (commentId) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COMMENTS.DELETE_COMMENT(commentId), {
                deleteReason: "Inappropriate content"
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    replyComment: async (commentId, replyData) => {
        try {
            const { content } = replyData;
            if (!content) {
                throw new Error("Missing required field: content");
            }
            const response = await apiClient.post(API_ENDPOINTS.COMMENTS.REPLY_COMMENT(commentId), replyData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    sendOrderToInstrument: async (testOrderId) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.TESTORDER.SEND_ORDER_TO_INSTRUMENT(testOrderId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getReportJobStatus: async (jobId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.TESTORDER.GET_REPORT_JOB_STATUS(jobId));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}

export default testOrderService;