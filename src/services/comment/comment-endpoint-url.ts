import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {} as const;

const ENDPOINT_MUTATIONS = {
  delete: (commentId: StringNumeric) => `comments/${commentId}`,
  update: (commentId: StringNumeric) => `comments/${commentId}`,
  create: 'comments',
} as const;

export const COMMENTS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
