import { createQueryKeys } from '@lukemorales/query-key-factory';

import { APPLICANTS_ENDPOINT_URL } from './applicant-endpoint-url';

export const applicantQueryKeys = createQueryKeys('applicant', {
  [APPLICANTS_ENDPOINT_URL.list]: null,
  detail: (id: string) => ({ queryKey: [id] }),
});
