import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { authQueryKeys } from './auth';
import { permissionsQueryKeys } from './permissions';
import { projectQueryKeys } from './project';
import { roleQueryKeys } from './roles';
import { userQueryKeys } from './user';

export const allQueryKeysStore = mergeQueryKeys(
  authQueryKeys,
  userQueryKeys,
  roleQueryKeys,
  projectQueryKeys,
  permissionsQueryKeys
);
