export const issuesPaths = {
  listIssue: (projectId: string) => `/projects/${projectId}`,
  createIssue: (projectId: string) => `/projects/${projectId}/tasks/create`,
  detailIssue: (projectId: string, issueId: string) => `/projects/${projectId}/tasks/${issueId}`,
} as const;
