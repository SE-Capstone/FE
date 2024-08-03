import { useCallback, useMemo, useState } from 'react';

const useQueryParams = <TQuery extends Record<string, unknown> | object = Record<string, unknown>>(
  initParams: Partial<TQuery> = {}
) => {
  const defaultQueryParams = useMemo(
    () =>
      ({
        ...initParams,
      } as TQuery),
    [initParams]
  );

  const [queryParams, setQueryParams] = useState<TQuery>(defaultQueryParams);

  const memoSetQueryParams = useCallback(
    (newQueryParams: Partial<TQuery>) =>
      setQueryParams((prevState) => ({ ...prevState, ...newQueryParams })),
    []
  );

  const memoSetQueryParamsOverride = useCallback(
    (newQueryParams?: Partial<TQuery>) =>
      setQueryParams((prevState) => {
        if (newQueryParams) {
          return newQueryParams as TQuery;
        }
        return prevState;
      }),
    []
  );

  const resetQueryParams = useCallback(
    () => setQueryParams(() => defaultQueryParams),
    [defaultQueryParams]
  );

  const memoQueryParams = useMemo(() => queryParams, [queryParams]);

  return {
    queryParams: memoQueryParams,
    setQueryParams: memoSetQueryParams,
    setQueryParamsOverride: memoSetQueryParamsOverride,
    resetQueryParams,
  };
};

export { useQueryParams };
