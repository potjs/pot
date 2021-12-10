import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type ErrorMode = 'none' | 'modal' | 'message' | undefined;

// default response result type
export interface Result<T = any> {
  code: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  result: T;
}

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

export interface Options<R = any> extends AxiosRequestConfig {
  authenticationScheme?: string;
  urlPrefix?: string;
  transform?: Transform<R>;
  requestOptions?: RequestOptions;
}

export abstract class Transform<R = any> {
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
