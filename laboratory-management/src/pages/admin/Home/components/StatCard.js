import React from "react";

const StatCard = ({ title, value, subtitle, icon: IconComponent, className, iconColor, variant = "default" }) => {
  // Màu động theo variant
  const variantColors = {
    default: "text-blue-500",
    success: "text-green-500", 
    warning: "text-yellow-500",
    danger: "text-red-500",
    info: "text-cyan-500",
    primary: "text-purple-500"
  };
  
  const finalIconColor = iconColor || variantColors[variant] || variantColors.default;
  const classNameDefault = `text-2xl mr-2 align-middle ${finalIconColor}`;
  className = className || classNameDefault;
  return (
    <div className="rounded-2xl border p-6 bg-white min-w-[220px] min-h-[140px] flex flex-col justify-between">
      <div className="font-semibold text-sm mb-6">{title}</div>
      <div>
        <div className="text-2xl font-bold mb-1 mt-2">{value}</div>
        <div className="text-gray-500 text-xs mt-2 flex items-center">
            {IconComponent && <IconComponent className={className} />}
            <span className="align-middle">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
