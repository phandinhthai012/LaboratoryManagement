
export const StatsCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    )
}

export default StatsCard;