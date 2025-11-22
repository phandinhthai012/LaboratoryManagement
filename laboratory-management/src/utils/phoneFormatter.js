/**
 * Format phone number to +84 prefix format
 * @param {string} value 
 * @returns {string} 
 */
export const formatPhoneNumber = (value) => {
    if (!value) return '';
    
    let formattedPhone = value;
    
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // If user starts typing and doesn't have +84, auto-add it
    if (digits.length > 0) {
        if (digits.startsWith('84')) {
            formattedPhone = '+' + digits;
        } else if (digits.startsWith('0')) {
            // Convert 0 prefix to +84
            formattedPhone = '+84' + digits.substring(1);
        } else if (!value.startsWith('+84')) {
            formattedPhone = '+84' + digits;
        } else {
            formattedPhone = '+84' + digits.substring(2);
        }
    }
    
    return formattedPhone;
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePhoneNumber = (phone) => {
    return /^\+84\d{9,10}$/.test(phone);
};

/**
 * Clean phone number (remove all formatting)
 * @param {string} phone - Phone number to clean
 * @returns {string} - Clean digits only
 */
export const cleanPhoneNumber = (phone) => {
    return phone.replace(/\D/g, '');
};