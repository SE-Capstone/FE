export const projectsPaths = {
  listProject: `/projects`,
  detailProject: (id: string) => `/projects/${id}`,
  detailProjectIssueTab: (id: string) => `/projects/${id}?tab=issue`,
} as const;
