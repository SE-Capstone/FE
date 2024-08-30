import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { authQueryKeys } from './auth';
import { roleQueryKeys } from './roles';
import { userQueryKeys } from './user';

export const allQueryKeysStore = mergeQueryKeys(authQueryKeys, userQueryKeys, roleQueryKeys);