export interface IPaginateReq {
  page: number;
  perPage: number;
}

export interface IRequestListBody<TFilter = any, TOrder = any> {
  paginate?: IPaginateReq;
  filter?: TFilter;
  order?: TOrder;
}
