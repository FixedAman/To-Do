import cryptoJS from "crypto-js";
const SECRET_KEY = import.meta.env.VITE_SITE_KEY;

export const encryptData = (data) => {
  try {
    return cryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error ", error);
    return null;
  }
};
export const decryptData = (cipherText) => {
  try {
    const bytes = cryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
  } catch (error) {
    console.log("error in decryption ", error);
    return null;
  }
};
