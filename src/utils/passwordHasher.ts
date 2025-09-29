import CryptoJS from 'crypto-js';

// Tipos para diferentes métodos de hash
export type HashMethod = 'SHA256' | 'SHA512' | 'MD5' | 'SHA1';

export class PasswordHasher {
  
  /**
   * Hashea una contraseña usando SHA256 (por defecto)
   */
  static hashPassword(password: string, method: HashMethod = 'SHA256'): string {
    switch (method) {
      case 'SHA256':
        return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      case 'SHA512':
        return CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
      case 'MD5':
        return CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
      case 'SHA1':
        return CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      default:
        return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    }
  }

  /**
   * Hashea una contraseña con salt
   */
  static hashPasswordWithSalt(password: string, salt: string, method: HashMethod = 'SHA256'): string {
    const saltedPassword = password + salt;
    return this.hashPassword(saltedPassword, method);
  }

  /**
   * Genera un hash compatible con diferentes formatos de backend
   */
  static hashForBackend(password: string, format: 'hex' | 'base64' = 'hex', method: HashMethod = 'SHA256'): string {
    let hash;
    
    switch (method) {
      case 'SHA256':
        hash = CryptoJS.SHA256(password);
        break;
      case 'SHA512':
        hash = CryptoJS.SHA512(password);
        break;
      case 'MD5':
        hash = CryptoJS.MD5(password);
        break;
      case 'SHA1':
        hash = CryptoJS.SHA1(password);
        break;
      default:
        hash = CryptoJS.SHA256(password);
    }

    if (format === 'base64') {
      return hash.toString(CryptoJS.enc.Base64);
    } else {
      return hash.toString(CryptoJS.enc.Hex);
    }
  }

  /**
   * Para APIs que esperan el hash como bytes
   */
  static hashToBytes(password: string, method: HashMethod = 'SHA256'): Uint8Array {
    const hash = this.hashPassword(password, method);
    // Convertir hex string a bytes
    const bytes = new Uint8Array(hash.length / 2);
    for (let i = 0; i < hash.length; i += 2) {
      bytes[i / 2] = parseInt(hash.substr(i, 2), 16);
    }
    return bytes;
  }

  /**
   * Ejemplo de diferentes formatos que tu API podría esperar
   */
  static getHashExamples(password: string) {
    return {
      sha256_hex: this.hashPassword(password, 'SHA256'),
      sha256_base64: this.hashForBackend(password, 'base64', 'SHA256'),
      sha512_hex: this.hashPassword(password, 'SHA512'),
      md5_hex: this.hashPassword(password, 'MD5'),
      bytes_array: Array.from(this.hashToBytes(password)),
    };
  }
}