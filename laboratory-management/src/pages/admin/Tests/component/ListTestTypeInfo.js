import React from 'react';
import { FaFlask } from 'react-icons/fa';

const ListTestTypeInfo = (testType) => {
    if (!testType) return null;

    return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
                <FaFlask className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                    <h4 className="font-semibold text-blue-900">{testType.name}</h4>
                    <p className="text-sm text-blue-700 mt-1">{testType.description}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div>
                            <span className="font-medium">Reagent:</span> {testType.reagentName}
                        </div>
                        <div>
                            <span className="font-medium">Thể tích:</span> {testType.requiredVolume} µL
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs font-medium text-blue-600">
                            Thông số ({testType.testParameters?.length || 0}):
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {testType.testParameters?.slice(0, 3).map((param, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {param.abbreviation}
                                </span>
                            ))}
                            {testType.testParameters?.length > 3 && (
                                <span className="text-xs text-blue-600">
                                    +{testType.testParameters.length - 3} khác
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        <code>ID: {testType.id}</code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListTestTypeInfo;