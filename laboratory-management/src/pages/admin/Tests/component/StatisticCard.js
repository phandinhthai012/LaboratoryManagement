export const StatisticCard = ({ title, value, icon: Icon, color = 'blue' }) => {
    // ✅ Định nghĩa màu sắc cho từng loại với style trắng
    const colorVariants = {
        blue: {
            bg: 'bg-white',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            textColor: 'text-gray-600',
            valueColor: 'text-gray-900'
        },
        yellow: {
            bg: 'bg-white',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            textColor: 'text-gray-600',
            valueColor: 'text-gray-900'
        },
        purple: {
            bg: 'bg-white',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            textColor: 'text-gray-600',
            valueColor: 'text-gray-900'
        },
        green: {
            bg: 'bg-white',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            textColor: 'text-gray-600',
            valueColor: 'text-gray-900'
        },
        red: {
            bg: 'bg-white',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            textColor: 'text-gray-600',
            valueColor: 'text-gray-900'
        }
    };

    const currentColor = colorVariants[color];

    return (
        <div className={`${currentColor.bg} rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium mb-1 ${currentColor.textColor}`}>
                        {title}
                    </p>
                    <p className={`text-3xl font-bold ${currentColor.valueColor}`}>
                        {value}
                    </p>
                </div>
                {Icon && (
                    <div className={`${currentColor.iconBg} p-4 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${currentColor.iconColor}`} />
                    </div>
                )}
            </div>
        </div>
    );
};