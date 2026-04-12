import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

class SecureStorage {
  private encryptionKey: Buffer;
  private storagePath: string;

  constructor(encryptionKey: string, storagePath: string = './secure-storage') {
    this.encryptionKey = crypto
      .createHash('sha256')
      .update(encryptionKey)
      .digest();
    this.storagePath = storagePath;
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  private encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedData: string): string {
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.encryptionKey,
      iv
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  save(key: string, data: string): void {
    const encryptedData = this.encrypt(data);
    const filePath = path.join(this.storagePath, key);
    fs.writeFileSync(filePath, encryptedData);
  }

  load(key: string): string | null {
    const filePath = path.join(this.storagePath, key);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const encryptedData = fs.readFileSync(filePath, 'utf8');
    try {
      return this.decrypt(encryptedData);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }

  delete(key: string): boolean {
    const filePath = path.join(this.storagePath, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  exists(key: string): boolean {
    const filePath = path.join(this.storagePath, key);
    return fs.existsSync(filePath);
  }
}

export default SecureStorage;
