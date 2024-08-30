import { useState } from 'react';

const DEFAULT_PAGE_SIZE = 20;

export function usePaginateReq() {
  const [paginate, setPaginate] = useState({
    pageIndex: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const nextPage = () => {
    setPaginate((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
  };

  const prevPage = () => {
    setPaginate((prev) => ({ ...prev, pageIndex: Math.max(prev.pageIndex - 1, 1) }));
  };

  const setPerPage = (size) => {
    setPaginate((prev) => ({
      ...prev,
      perPage: Math.max(size, DEFAULT_PAGE_SIZE),
    }));
  };

  return {
    paginate,
    pageIndex: paginate.pageIndex,
    pageSize: paginate.pageSize,
    nextPage,
    prevPage,
    setPerPage,
    setPaginate,
  };
}
