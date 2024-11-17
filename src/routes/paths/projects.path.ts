export const projectsPaths = {
  listProject: `/projects`,
  detailProject: (id: string) => `/projects/${id}`,
} as const;
