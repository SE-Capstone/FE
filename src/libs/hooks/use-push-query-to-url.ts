import { useCallback } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

export const usePushQueryToUrl = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pushQuery = useCallback(
    (queryObj: Record<string, string>) => {
      const newQuery = new URLSearchParams({ ...queryObj }).toString();
      navigate(`${pathname}?${newQuery}`);
    },
    [navigate, pathname]
  );

  return { pushQuery };
};
