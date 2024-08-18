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
  page: number;
  perPage: number;
}

export type IErrorValidation = {
  field: string;
  message: string;
}[];
