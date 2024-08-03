import { useCallback, useLayoutEffect, useMemo, useState, useTransition } from 'react';

import { removeAccents } from '../helpers';

export function useSearchTransition<T>(data: T[] = []) {
  const [isPending, startTransition] = useTransition();

  const [filterData, setFilterData] = useState<T[]>(() => data);
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = useCallback(
    (callback: (value: T) => string, keyword: string) => {
      setSearchValue(keyword);

      startTransition(() => {
        if (!keyword) {
          return setFilterData(data);
        }

        return setFilterData((prev) =>
          prev.filter((value) =>
            removeAccents(callback(value))
              .toLowerCase()
              .includes(removeAccents(keyword.toLowerCase()))
          )
        );
      });
    },
    [data]
  );

  useLayoutEffect(() => {
    if (data) {
      setFilterData(data);
    }
  }, [data]);

  return useMemo(
    () =>
      ({
        searchValue,
        filterData,
        isPending,
        handleSearch,
      } as const),
    [searchValue, filterData, handleSearch, isPending]
  );
}
