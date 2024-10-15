import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { applicantQueryKeys } from './applicants';
import { authQueryKeys } from './auth';
import { issueQueryKeys } from './issue';
import { jobQueryKeys } from './job';
import { labelQueryKeys } from './label';
import { permissionsQueryKeys } from './permissions';
import { positionQueryKeys } from './position';
import { projectQueryKeys } from './project';
import { roleQueryKeys } from './roles';
import { statusQueryKeys } from './status';
import { userQueryKeys } from './user';

export const allQueryKeysStore = mergeQueryKeys(
  authQueryKeys,
  userQueryKeys,
  roleQueryKeys,
  issueQueryKeys,
  projectQueryKeys,
  permissionsQueryKeys,
  jobQueryKeys,
  applicantQueryKeys,
  positionQueryKeys,
  labelQueryKeys,
  statusQueryKeys
);
