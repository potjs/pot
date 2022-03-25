import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import type { Options, RequestOptions, Result } from './interface';

import axios from 'axios';
import cloneDeep from 'lodash.clonedeep';
import { AxiosCanceler } from './canceler';
import { isFunction, isUnDef } from '@potjs/shared';

export class Http<R = Result> {
  private readonly axiosInstance: AxiosInstance;
  private readonly options: Options<R>;

  constructor(options: Options<R>) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
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
    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } =
      transform;

    const axiosCanceler = new AxiosCanceler();

    // Add a request interceptor
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const { ignoreCancelToken } = config.headers || {};

      const ignoreCancel = !isUnDef(ignoreCancelToken)
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

  get<T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET', url }, options);
  }

  post<T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST', url }, options);
  }

  put<T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT', url }, options);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE', url }, options);
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
              reject(err);
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
