import type { EncryptionParams } from '@potjs/cipher';
import { AesEncryption } from '@potjs/cipher';
import { isNullOrUnDef } from '@potjs/shared';

const cacheCipher = {
  key: '_10101010101010@',
  iv: '@01010101010101_',
};

export type Nullable<T> = T | null;

export type WebCacheOptions = {
  prefixKey: string;
  storage: Storage;
  hasEncrypt: boolean;
  timeout?: Nullable<number>;
};

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string;
  storage: Storage;
  hasEncrypt: boolean;
  timeout?: Nullable<number>;
}

export class WebCache {
  private readonly storage;
  private readonly prefixKey?;
  private readonly encryption;
  private readonly hasEncrypt;
  private readonly timeout;

  constructor({
    storage,
    prefixKey,
    encryption,
    hasEncrypt,
    timeout,
  }: WebCacheOptions & { encryption: AesEncryption }) {
    this.storage = storage;
    this.prefixKey = prefixKey;
    this.encryption = encryption;
    this.hasEncrypt = hasEncrypt;
    this.timeout = timeout;
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`.toUpperCase();
  }

  /**
   * Set cache
   */
  set(key: string, value: any, expire = this.timeout) {
    const stringData = JSON.stringify({
      value,
      time: Date.now(),
      expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null,
    });
    const stringifyValue = this.hasEncrypt ? this.encryption.encryptByAES(stringData) : stringData;
    this.storage.setItem(this.getKey(key), stringifyValue);
  }

  /**
   * Read cache
   */
  get(key: string, def: any = null): any {
    const val = this.storage.getItem(this.getKey(key));
    if (!val) return def;

    try {
      const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;
      const data = JSON.parse(decVal);
      const { value, expire } = data;
      if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
        return value;
      }
      this.remove(key);
    } catch (e) {
      return def;
    }
  }

  /**
   * Delete cache based on key
   */
  remove(key: string) {
    this.storage.removeItem(this.getKey(key));
  }

  /**
   * Delete all caches of this instance
   */
  clear(): void {
    this.storage.clear();
  }
}

export const createStorage = ({
  prefixKey = '',
  storage = sessionStorage,
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = true,
}: Partial<CreateStorageParams> = {}) => {
  if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
  }

  const encryption = new AesEncryption({ key, iv });

  return new WebCache({
    storage,
    encryption,
    prefixKey,
    hasEncrypt,
    timeout,
  });
};
