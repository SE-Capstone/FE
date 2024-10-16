import type { ThemingProps } from '@chakra-ui/react';

export type QueryListStatusInput = {
  projectId: string;
};

export type IStatus = {
  id: string;
  name: string;
  description: string;
  position: number;
  color: ThemingProps['colorScheme'];
  projectId: string;
  issueCount: number;
};
