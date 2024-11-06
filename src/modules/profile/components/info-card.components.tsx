import type React from 'react';

import { Stack, Text } from '@chakra-ui/react';

import type { StackProps, TextProps } from '@chakra-ui/react';

export interface InfoCardProps {
  data: { label: string; text?: React.ReactNode }[];
  labelProps?: TextProps;
  stackProps?: StackProps;
}

export const InfoCard: React.FC<InfoCardProps> = ({ data, labelProps, stackProps }) => (
  <Stack direction="column" spacing="16px">
    {data.map(({ label, text }, index) => (
      <Stack key={index} direction="row" spacing="16px" {...stackProps}>
        <>
          <Text
            color="neutral.300"
            sx={{
              fontWeight: 'medium',
              w: { base: '100px', md: '200px' },
            }}
            {...labelProps}
          >
            {`${label}:`}
          </Text>
          <Text wordBreak="break-all" whiteSpace="normal" flex={1} fontWeight={500}>
            {text || ''}
          </Text>
        </>
      </Stack>
    ))}
  </Stack>
);
