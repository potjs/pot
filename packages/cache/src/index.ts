import { createStorage as create, CreateStorageParams } from './storageCache';

// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

export type Options = Partial<CreateStorageParams>;

const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    // No encryption in debug mode
    hasEncrypt: false,
    storage,
    prefixKey: `__app__`.toUpperCase(),
    ...options,
  };
};

export const WebStorage = create(createOptions(sessionStorage));

export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => {
  return create(createOptions(storage, options));
};

export const createSessionStorage = (options: Options = {}) => {
  return createStorage(sessionStorage, { timeout: DEFAULT_CACHE_TIME, ...options });
};

export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, { timeout: DEFAULT_CACHE_TIME, ...options });
};

export default WebStorage;
