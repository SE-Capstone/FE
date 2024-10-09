import { Box, Button, Grid, GridItem, HStack, Spacer } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { AddNewPositionWidget } from './add-new-position.widget';
import { usePositionsQueryFilterStateContext } from '../contexts';

import { SearchInput } from '@/components/elements';

export function ActionTablePositionsWidget() {
  const { positionsQueryState, setPositionsQueryFilterState } =
    usePositionsQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterPosition = pathname.includes('positions');

  return (
    <Box p={5} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Grid
          w={{
            base: '80%',
            lg: '70%',
            xl: '60%',
          }}
          gap={2}
        >
          <GridItem colSpan={2}>
            <SearchInput
              placeholder="Enter title..."
              initValue={positionsQueryState.filters.title || ''}
              onHandleSearch={(keyword) => {
                setPositionsQueryFilterState({ title: keyword });
              }}
            />
          </GridItem>
        </Grid>
        {isShowFilterPosition && (
          <>
            <Spacer />
            <AddNewPositionWidget>
              <Button leftIcon={<>+</>}>Create</Button>
            </AddNewPositionWidget>
          </>
        )}
      </HStack>
    </Box>
  );
}
