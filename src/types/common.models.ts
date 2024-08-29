export interface IBaseResponse<TData = unknown> {
  data: TData;
  message?: string;
  locale?: string;
}

export interface IBaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IBasePagination {
  pageIndex: number;
  pageSize: number;
}

export type IErrorValidation = {
  field: string;
  message: string;
}[];

export type IBaseQueryParams<TFilter = any> = {
  pageIndex: number;
  pageSize: number;
  filter?: TFilter;
};
