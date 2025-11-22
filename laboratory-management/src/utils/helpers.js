import JSEncrypt from "jsencrypt";
import apiClient from "../services/apiClient";


export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export async function encryptPassword(password) {
  // Gọi API để lấy public key
  const res = await apiClient.get("/api/v1/iam/auth/public-key");
  const publicKey = res.data.publicKey;

  // Mã hoá bằng RSA
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(
    `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`
  );
  return encryptor.encrypt(password);
}


export const validatePassword = (password) => {
  // Regex: ^(?=.*[A-Za-z])(?=.*\d).{8,128}$
  // - At least 1 letter (A-Z or a-z)
  // - At least 1 digit (0-9)
  // - Length between 8-128 characters
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/;
  return passwordRegex.test(password);
};

export const formatDateWithTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('vi-VN'),
    time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };
};