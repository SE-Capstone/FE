import type { Method } from 'axios';

export interface IMetaResponse {
  currentPage: number;
  lastPage: number;
  next: number | null;
  perPage: number;
  prev: number | null;
  total: number;
}

export type RequestApiConfigType = Record<
  string,
  {
    url: string;
    method: Uppercase<Method>;
  }
>;

export interface Request {
  path: string;
  method: Uppercase<Method>;
}

export interface IResponseApi<TData = unknown> {
  data: TData;
  request: Request;
  message: string;
  statusCode: number;
  timestamp: string;
  status: string;
}

export type IResponseListApi<TData = unknown> = IResponseApi<{
  data: TData[];
  meta: IMetaResponse;
}>;

export interface IResponseErrorApi {
  statusCode: number;
  status: string;
  error: string;
  request: Request;
  message: string;
  messages?: Array<{ field: string; errors: Array<string> }>; // for error validation
}

export interface IBaseEntity {
  id: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
