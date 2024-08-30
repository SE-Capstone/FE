import type { Method } from 'axios';

export interface IMetaResponse {
  pageIndex: number;
  totalPages: number;
  next: number | null;
  pageSize: number;
  prev: number | null;
  totalCount: number;
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

export interface IRequest {
  params: {
    id: string;
  };
}

export interface IResponseApi<TData = unknown> {
  data: TData;
  meta?: IMetaResponse;
  message: string;
  statusCode: number;
}

export type IResponseListApi<TData = unknown> = IResponseApi<{
  data: TData[];
  meta: IMetaResponse;
}>;

export interface IResponseErrorApi {
  status: number;
  error: string;
  message: string;
  title: string;
  errors?: Record<string, Array<string>>; // for error validation
}

export interface IBaseEntity {
  id: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
