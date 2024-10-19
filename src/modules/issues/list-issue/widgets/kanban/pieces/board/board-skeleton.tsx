import { forwardRef, memo } from 'react';

import { Box, Flex, Stack, xcss } from '@atlaskit/primitives';
import { GridItem, Skeleton, SkeletonText } from '@chakra-ui/react';

const boardStyles = xcss({
  display: 'flex',
  justifyContent: 'start',
  gap: 'space.200',
  flexDirection: 'row',
  height: '100%',
  overflowY: 'auto',
});

const columnStyles = xcss({
  backgroundColor: 'elevation.surface.raised',
  borderRadius: 'border.radius.300',
  position: 'relative',
  padding: 'space.100',
});

const stackStyles = xcss({
  width: '270px',
  minHeight: '0',
  flexGrow: 1,
});

const BoardSkeleton = forwardRef<HTMLDivElement>(() => (
  <Box xcss={boardStyles}>
    {[...Array(2)].map((_, index) => (
      <Flex key={index} direction="column" xcss={[columnStyles]}>
        <Stack xcss={stackStyles}>
          {[...Array(3)].map((_, index) => (
            <GridItem
              key={index}
              _hover={{ bg: 'gray.300' }}
              rounded={2}
              border="1px solid"
              borderColor="gray.300"
              transition="background 0.3s ease"
              p={3}
              w="100%"
              bg=""
              shadow="card"
              mb={3}
            >
              <>
                <Skeleton height="20px" width="70%" mb={3} />
                <SkeletonText mt="4" noOfLines={3} spacing="4" />
              </>
            </GridItem>
          ))}
        </Stack>
      </Flex>
    ))}
  </Box>
));

export default memo(BoardSkeleton);
