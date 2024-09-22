import type React from 'react';

import { Stack, Text } from '@chakra-ui/react';

import type { TextProps } from '@chakra-ui/react';

export interface InfoCardProps {
  data: { label: string; text?: React.ReactNode }[];
  labelProps?: TextProps;
}

export const InfoCard: React.FC<InfoCardProps> = ({ data, labelProps }) => (
  <Stack direction="column" spacing="16px">
    {data.map(({ label, text }, index) => (
      <Stack key={index} direction="row" spacing="16px">
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
