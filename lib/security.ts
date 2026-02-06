// lib/security.ts
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_VAULT_KEY || "tu-clave-secreta-provisional";

export const Security = {
  // Encripta las tareas antes de guardarlas en localStorage
  encryptData: (data: any) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  },

  // Desencripta los datos cuando el usuario pone su huella/PIN
  decryptData: (ciphertext: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData ? JSON.parse(decryptedData) : [];
    } catch (e) {
      return [];
    }
  },

  // Verifica el PIN de 4 dígitos
  validatePin: (input: string, savedPin: string) => {
    return input === savedPin;
  }
};