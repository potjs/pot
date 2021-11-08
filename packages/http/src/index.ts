import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';

import axios from 'axios';
import cloneDeep from 'lodash.clonedeep';
import { AxiosCanceler } from './cancel';
import { isFunction, isUndefined } from './helpers';

export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
  // Splicing request parameters to url
  joinParamsToUrl?: boolean;
  // Format request parameter time
  formatDate?: boolean;
  // Whether to process the request result
  isTransformResponse?: boolean;
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isReturnNativeResponse?: boolean;
  // Whether to join url
  joinPrefix?: boolean;
  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string;
  // Error message prompt type
  errorMessageMode?: ErrorMessageMode;
  // Whether to add a timestamp
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  // Whether to send token in header
  withToken?: boolean;
}

export interface Result<T = any> {
  code: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  result: T;
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string;
  urlPrefix?: string;
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {
  // Process configuration before request
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

  // Request successfully processed
  transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;

  // 请求失败处理
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  // 请求之前的拦截器
  requestInterceptors?: (
    config: AxiosRequestConfig,
    options: CreateAxiosOptions,
  ) => AxiosRequestConfig;

  // 请求之后的拦截器
  responseInterceptors?: (res: AxiosResponse) => AxiosResponse;

  // 请求之前的拦截器错误处理
  requestInterceptorsCatch?: (error: Error) => void;

  // 请求之后的拦截器错误处理
  responseInterceptorsCatch?: (error: Error) => void;
}

export class PotHttp {
  private readonly axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  setHeader(headers: any): void {
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) {
      return;
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    const axiosCanceler = new AxiosCanceler();

    // Add a request interceptor
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      // If cancel repeat request is turned on, then cancel repeat request is prohibited
      const {
        headers: { ignoreCancelToken },
      } = config;

      const ignoreCancel = !isUndefined(ignoreCancelToken)
        ? ignoreCancelToken
        : this.options.requestOptions?.ignoreCancelToken;

      !ignoreCancel && axiosCanceler.addPending(config);
      if (isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }
      return config;
    }, requestInterceptorsCatch);

    // Add a response interceptor
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config);
      if (isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, responseInterceptorsCatch);
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options);
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);
    const transform = this.getTransform();

    const { requestOptions } = this.options;

    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
    if (isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error('request error!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error) => {
          if (isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }
          reject(e);
        });
    });
  }
}
