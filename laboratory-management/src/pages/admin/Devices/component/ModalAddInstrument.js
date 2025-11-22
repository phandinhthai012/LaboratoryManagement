import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import Select from 'react-select';
import { useAllConfigurations } from '../../../../hooks/useWareHouse';

const ModalAddInstrument = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    port: '',
    model: '',
    type: '',
    serialNumber: '',
    vendorId: '',
    configurationSettingIds: [''],
    compatibleReagentIds: ['']
  });

  const [errors, setErrors] = useState({});

  // Fetch configurations for select (page=0, size=1000)
  const { data: configsData, isLoading: isConfigsLoading } = useAllConfigurations({ page: 0, size: 1000 });

  // Normalize various possible response shapes into an array
  const configs = (() => {
    const d = configsData;
    if (!d) return [];
    // Common shapes: array, { data: [...] }, { data: { content: [...] } }, { result: [...] }, { values: [...] }
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.content)) return d.content;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d.data?.content)) return d.data.content;
    if (Array.isArray(d.data?.values)) return d.data.values;
    if (Array.isArray(d.data?.result)) return d.data.result;
    if (Array.isArray(d.result)) return d.result;
    if (Array.isArray(d.values)) return d.values;
    if (Array.isArray(d.data?.data)) return d.data.data;
    // fallback: try to find first array value among top-level properties
    const arr = Object.keys(d).map(k => d[k]).find(v => Array.isArray(v));
    return arr || [];
  })();

  const configOptions = configs.map(cfg => ({
    // Prefer explicit id fields, fallback to code; label will fall back to the id so the select always shows something
    value: cfg.id || cfg.configurationId || cfg.configId || cfg.code,
    // Show ID as label so select displays the configuration ID only
    label: (cfg.id || cfg.configurationId || cfg.configId || cfg.code)
  }));

  const selectedConfigValues = (formData.configurationSettingIds || []).filter(Boolean);
  const selectedConfigOptions = configOptions.filter(o => selectedConfigValues.includes(o.value));

  const handleConfigSelectChange = (selected) => {
    const ids = (selected || []).map(s => s.value);
    setFormData(prev => ({ ...prev, configurationSettingIds: ids }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayInputChange = (index, value, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayItem = (index, arrayName) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const name = (formData.name || '').toString().trim();
    const ip = (formData.ipAddress || '').toString().trim();
    const model = (formData.model || '').toString().trim();
    const type = (formData.type || '').toString().trim();
    const serial = (formData.serialNumber || '').toString().trim();
    const portNum = Number(formData.port);

    if (!name) {
      newErrors.name = 'Tên thiết bị là bắt buộc';
    }
    if (!ip) {
      newErrors.ipAddress = 'IP Address là bắt buộc';
    } else {
      // Strict IP validation: each octet 0-255
      const ipRegex = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
      if (!ipRegex.test(ip)) {
        newErrors.ipAddress = 'IP Address không hợp lệ';
      }
    }

    if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
      newErrors.port = 'Port phải là số nguyên từ 1 đến 65535';
    }

    if (!model) {
      newErrors.model = 'Model là bắt buộc';
    }

    if (!type) {
      newErrors.type = 'Loại thiết bị là bắt buộc';
    }

    if (!serial) {
      newErrors.serialNumber = 'Số serial là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Filter out empty array items
    const cleanedData = {
      ...formData,
      name: (formData.name || '').toString().trim(),
      ipAddress: (formData.ipAddress || '').toString().trim(),
      port: Number.parseInt(formData.port, 10),
      model: (formData.model || '').toString().trim(),
      type: (formData.type || '').toString().trim(),
      serialNumber: (formData.serialNumber || '').toString().trim(),
      vendorId: (formData.vendorId || '').toString().trim() || undefined,
      configurationSettingIds: (formData.configurationSettingIds || []).map(i => i.toString().trim()).filter(id => id),
      compatibleReagentIds: (formData.compatibleReagentIds || []).map(i => i.toString().trim()).filter(id => id)
    };

    onSubmit(cleanedData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      ipAddress: '',
      port: '',
      model: '',
      type: '',
      serialNumber: '',
      vendorId: '',
      configurationSettingIds: [''],
      compatibleReagentIds: ['']
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Thêm Thiết Bị Mới</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên thiết bị */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên thiết bị *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="VD: Máy Hóa Sinh"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* IP Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Address *
              </label>
              <input
                type="text"
                name="ipAddress"
                value={formData.ipAddress}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ipAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="192.168.1.100"
              />
              {errors.ipAddress && <p className="text-red-500 text-sm mt-1">{errors.ipAddress}</p>}
            </div>

            {/* Port */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Port *
              </label>
              <input
                type="number"
                name="port"
                value={formData.port}
                onChange={handleInputChange}
                min="1"
                max="65535"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.port ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="5001"
              />
              {errors.port && <p className="text-red-500 text-sm mt-1">{errors.port}</p>}
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Cobas 8000"
              />
              {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại thiết bị *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Chọn loại thiết bị</option>
                <option value="Hóa sinh">Hóa sinh</option>
                <option value="Huyết học">Huyết học</option>
                <option value="Vi sinh">Vi sinh</option>
                <option value="Miễn dịch">Miễn dịch</option>
                <option value="Sinh hóa">Sinh hóa</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số Serial *
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.serialNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="C8K-SN-TEST-001"
              />
              {errors.serialNumber && <p className="text-red-500 text-sm mt-1">{errors.serialNumber}</p>}
            </div>

            {/* Vendor ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor ID
              </label>
              <input
                type="text"
                name="vendorId"
                value={formData.vendorId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VDR-251104142101-b2c3d4e5-1002"
              />
            </div>

            {/* Configuration Setting IDs (select populated from API) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Configuration Setting IDs
              </label>
              {/* Fetch configs from API (page=0,size=1000) */}
              {
                // Call hook at top-level: useAllConfigurations is used below (see top of file)
              }
              <Select
                isMulti
                options={configOptions}
                isLoading={isConfigsLoading}
                onChange={handleConfigSelectChange}
                value={selectedConfigOptions}
                classNamePrefix="react-select"
                placeholder={isConfigsLoading ? 'Đang tải...' : 'Chọn Configuration Setting (có thể chọn nhiều)'}
                noOptionsMessage={() => 'Không có cấu hình'}
              />
            </div>

            {/* Compatible Reagent IDs */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compatible Reagent IDs
              </label>
              {formData.compatibleReagentIds.map((id, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'compatibleReagentIds')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="RTY-ALINITY-002"
                  />
                  {formData.compatibleReagentIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'compatibleReagentIds')}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('compatibleReagentIds')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <FaPlus className="w-3 h-3" />
                Thêm Compatible Reagent ID
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Đang thêm...' : 'Thêm thiết bị'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddInstrument;
