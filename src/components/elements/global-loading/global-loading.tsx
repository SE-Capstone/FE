import { Spinner, Stack } from '@chakra-ui/react';

export interface GlobalLoadingProps {
  isLoading: boolean;
}

export function GlobalLoading({ isLoading }: GlobalLoadingProps) {
  return isLoading ? (
    <Stack
      sx={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        inset: 0,
        position: 'fixed',
      }}
    >
      <Spinner size="xl" thickness="3px" />
    </Stack>
  ) : null;
}
