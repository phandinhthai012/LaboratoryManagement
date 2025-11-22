import React from 'react';
import { FaUserShield, FaUserMd, FaFlask, FaConciergeBell, FaUserTie, FaUser } from 'react-icons/fa';


const baseIconClasses = "text-2xl transition-transform duration-300 group-hover:scale-110";

export const roleIconMap = {
    "ROLE_ADMIN": {
        icon: FaUserShield,
        className: `text-red-500 ${baseIconClasses}` // Màu đỏ cho Admin
    },
    "LAB_SUPERVIOR_EDIT": {
        icon: FaUserMd,
        className: `text-sky-500 ${baseIconClasses}` // Màu xanh da trời
    },
    "LAB_SUPERVIOR_EE": {
        icon: FaFlask,
        className: `text-teal-500 ${baseIconClasses}` // Màu xanh mòng két
    },
    "ROLE_LAB_MANAGER": {
        icon: FaConciergeBell,
        className: `text-amber-500 ${baseIconClasses}` // Màu hổ phách
    },
    "LAB_SUPERVIOR_EER": {
        icon: FaConciergeBell,
        className: `text-amber-500 ${baseIconClasses}`
    },
    "ROLE_USER": {
        icon: FaUser,
        className: `text-slate-500 ${baseIconClasses}` // Màu xám
    },
    "LAB_SUPERVIOR_EERR": {
        icon: FaUserTie,
        className: `text-violet-500 ${baseIconClasses}` // Màu tím
    },
}



const RoleBadge = ({ roleCode }) => {
    const roles = {
        'ROLE_ADMIN': { color: 'bg-red-100 text-red-800', label: 'Admin' },
        'ROLE_DOCTOR': { color: 'bg-blue-100 text-blue-800', label: 'Doctor' },
        'ROLE_TECHNICIAN': { color: 'bg-green-100 text-green-800', label: 'Technician' },
        'ROLE_RECEPTIONIST': { color: 'bg-purple-100 text-purple-800', label: 'Receptionist' },
    };

    const roleInfo = roles[roleCode];
    if (!roleInfo) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{roleCode}</span>;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${roleInfo.color}`}>
            {roleInfo.label}
        </span>
    );
};
export default RoleBadge;