import React from 'react';
import { FaDownload } from 'react-icons/fa';

const TestResultItem = ({ result }) => (
  <div className="bg-white rounded-lg border p-4 flex flex-col md:flex-row md:items-center justify-between">
    <div>
      <div className="font-semibold text-lg">{result.name}</div>
      <div className="text-sm text-gray-500">
        Order Date: {result.orderDate}
        {result.completedDate && <> • Completed: {result.completedDate}</>}
      </div>
    </div>
    <div className="flex items-center gap-2 mt-3 md:mt-0">
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
        {result.status}
      </span>
      {result.status === 'completed' && (
        <button className="ml-2 p-2 rounded border hover:bg-gray-100">
          <FaDownload />
        </button>
      )}
    </div>
  </div>
);

export default TestResultItem;