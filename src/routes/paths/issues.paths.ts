export const issuesPaths = {
  listIssue: (projectId: string) => `/projects/${projectId}`,
  createIssue: (projectId: string) => `/projects/${projectId}/issues/create`,
  detailIssue: (projectId: string, issueId: string) => `/projects/${projectId}/issues/${issueId}`,
} as const;
