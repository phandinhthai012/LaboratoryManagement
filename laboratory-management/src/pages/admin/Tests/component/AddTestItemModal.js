import React, { useState } from 'react';
import {
    FaFlask, FaTimes, FaPlus, FaSpinner, FaSearch
} from 'react-icons/fa';
import { useTestCatalogs, useTestOrder } from '../../../../hooks/useTestOrder';

const AddTestItemModal = ({ isOpen, onClose, testOrderId, existingTestNames = [] }) => {
    const { data: testCatalogs, isLoading: isLoadingCatalogs } = useTestCatalogs();
    const { addTestOrderItem, isAddItemLoading } = useTestOrder();
    
    const [selectedTestName, setSelectedTestName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    console.log('testCatalogs', testCatalogs);

    const availableTests = testCatalogs?.filter(test => 
        !existingTestNames.includes(test.testName)
    ) || [];

    const filteredTests = availableTests.filter(test =>
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.localCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddTest = async () => {
        if (!selectedTestName) {
            alert('Vui lòng chọn xét nghiệm');
            return;
        }

        try {
            await addTestOrderItem({
                testOrderId: testOrderId,
                testName: selectedTestName
            });
            
            // Reset and close
            setSelectedTestName('');
            setSearchTerm('');
            onClose();
            
        } catch (error) {
            console.error('Error adding test item:', error);
            alert('Thêm xét nghiệm thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleClose = () => {
        setSelectedTestName('');
        setSearchTerm('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FaFlask className="mr-2 text-purple-600" />
                            Thêm Xét Nghiệm
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Search */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaSearch className="inline mr-1" />
                                Tìm kiếm xét nghiệm
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Nhập tên xét nghiệm hoặc mã..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Test List */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn xét nghiệm ({filteredTests.length} khả dụng)
                            </label>
                            
                            {isLoadingCatalogs ? (
                                <div className="flex justify-center py-8">
                                    <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                                    <span className="ml-2 text-gray-600">Đang tải...</span>
                                </div>
                            ) : filteredTests.length > 0 ? (
                                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                                    {filteredTests.map((test) => (
                                        <div
                                            key={test.id}
                                            className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                                                selectedTestName === test.testName
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => setSelectedTestName(test.testName)}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="selectedTest"
                                                    checked={selectedTestName === test.testName}
                                                    onChange={() => setSelectedTestName(test.testName)}
                                                    className="mr-3 text-blue-600"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">
                                                        {test.testName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 grid grid-cols-2 gap-4 mt-1">
                                                        <span>Mã: {test.localCode}</span>
                                                        <span>LOINC: {test.loincCode}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 grid grid-cols-3 gap-4 mt-1">
                                                        <span>Đơn vị: {test.unit}</span>
                                                        <span>Phương pháp: {test.method}</span>
                                                        <span>Mẫu: {test.specimenType}</span>
                                                    </div>
                                                    <div className="text-xs text-green-600 mt-1">
                                                        Tham chiếu: {test.referenceRange} {test.unit}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FaFlask className="mx-auto text-3xl mb-2" />
                                    <p>
                                        {searchTerm ? 'Không tìm thấy xét nghiệm phù hợp' : 'Không có xét nghiệm khả dụng'}
                                    </p>
                                    {existingTestNames.length > 0 && (
                                        <p className="text-sm mt-2">
                                            ({existingTestNames.length} xét nghiệm đã có trong đơn)
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Selected Test Preview */}
                        {selectedTestName && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="text-sm font-medium text-blue-800">
                                    Đã chọn: {selectedTestName}
                                </div>
                                {/* {(() => {
                                    const selectedTest = filteredTests.find(t => t.testName === selectedTestName);
                                    return selectedTest ? (
                                        <div className="text-xs text-blue-600 mt-1">
                                            {selectedTest.localCode} • {selectedTest.method} • {selectedTest.specimenType}
                                        </div>
                                    ) : null;
                                })()} */}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={handleClose}
                            disabled={isAddItemLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleAddTest}
                            disabled={!selectedTestName || isAddItemLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isAddItemLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Đang thêm...
                                </>
                            ) : (
                                <>
                                    <FaPlus className="mr-2" />
                                    Thêm Xét Nghiệm
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTestItemModal;