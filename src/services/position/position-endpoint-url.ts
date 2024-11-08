import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'positions',
  detail: (positionId: StringNumeric) => `positions/${positionId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  delete: (positionId: StringNumeric) => `positions/${positionId}`,
  update: `positions`,
  create: 'positions',
} as const;

export const POSITIONS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
