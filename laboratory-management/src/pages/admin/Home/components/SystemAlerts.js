import React from "react";


const SystemAlerts = ({logs}) => {
  return (
    <div className="rounded-2xl bg-white">
      <div className="text-sm font-semibold mb-4">
        <span className="text-sm font-semibold">Thông báo hệ thống</span>
      </div>
      <div className="text-gray-500 text-sm">
        {logs.map((log) => (
          <div key={log.id} className="mb-4 p-3 border rounded-lg hover:bg-gray-50 transition">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{log.action}</span>
              <span className="text-gray-400">{new Date(log.access_time).toLocaleString()}</span>
            </div>
            <div className="text-sm">
              <p>IP Address: {log.ip_addr}</p>
              <p>User ID: {log.user_id}</p>
              <p>Medical Record ID: {log.medical_record_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlerts;
