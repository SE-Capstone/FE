import React from 'react';

import { useLocation } from 'react-router-dom';

import { parseQueryStringToObject } from '@/libs/helpers';

export function useGetQueryString<T extends Record<string, unknown> | object = object>() {
  const location = useLocation();

  const query = React.useMemo(
    () => parseQueryStringToObject<T>(location.search),
    [location.search]
  );

  return query;
}
