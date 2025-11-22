

const Loading = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span>Đang tải...</span>
            </div>
        </div>
    );
};

export default Loading;



{/* <tr key={index} className="animate-pulse">
  <td className="px-6 py-4">
    <div className="flex items-center">
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
      <div>
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </td>
  <td className="px-6 py-4">
    <div className="h-4 bg-gray-300 rounded w-16"></div>
  </td>
  <td className="px-6 py-4">
    <div className="h-4 bg-gray-300 rounded w-32"></div>
  </td>
  <td className="px-6 py-4">
    <div className="h-4 bg-gray-300 rounded w-20"></div>
  </td>
  <td className="px-6 py-4">
    <div className="flex space-x-2">
      <div className="h-6 w-6 bg-gray-300 rounded"></div>
      <div className="h-6 w-6 bg-gray-300 rounded"></div>
    </div>
  </td>
</tr> */}