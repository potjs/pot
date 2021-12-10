import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';

import axios from 'axios';
import cloneDeep from 'lodash.clonedeep';
import { AxiosCanceler } from './cancel';
import { isFunction, isUndefined } from './helpers';

export type ErrorMode = 'none' | 'modal' | 'message' | undefined;

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
  errorMode?: ErrorMode;
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

export interface Options<Res = any> extends AxiosRequestConfig {
  authenticationScheme?: string;
  urlPrefix?: string;
  transform?: HttpTransform<Res>;
  requestOptions?: RequestOptions;
}

export abstract class HttpTransform<R = any> {
  // 处理请求之前的配置
  beforeRequest?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

  // 请求之前的拦截器
  requestInterceptors?: (config: AxiosRequestConfig, options: Options<R>) => AxiosRequestConfig;

  // 请求之后的拦截器
  responseInterceptors?: (res: AxiosResponse<R>) => AxiosResponse;

  // 处理响应体
  transformResponse?: (res: AxiosResponse<R>, options: RequestOptions) => any;

  // 请求之前的拦截器错误处理
  requestInterceptorsCatch?: (error: Error) => void;

  // 请求之后的拦截器错误处理
  responseInterceptorsCatch?: (error: Error) => void;

  // 处理异常
  transformCatch?: (e: Error, options: RequestOptions) => Promise<any>;
}

export class Http<R = Result> {
  private readonly axiosInstance: AxiosInstance;
  private readonly options: Options<R>;

  constructor(options: Options<R>) {
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
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<R>) => {
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
    let conf: Options<R> = cloneDeep(config);
    const transform = this.getTransform();

    const { requestOptions } = this.options;

    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequest, transformCatch, transformResponse } = transform || {};
    if (isFunction(beforeRequest)) {
      conf = beforeRequest(conf, opt);
    }
    conf.requestOptions = opt;

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<R>>(conf)
        .then((res: AxiosResponse<R>) => {
          if (isFunction(transformResponse)) {
            try {
              const ret = transformResponse(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error('request error!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error) => {
          if (isFunction(transformCatch)) {
            reject(transformCatch(e, opt));
            return;
          }
          reject(e);
        });
    });
  }
}
