import { Box, Button, Grid, GridItem, HStack, Spacer } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { AddNewJobWidget } from './add-new-job.widget';
import { useJobsQueryFilterStateContext } from '../contexts';

import { SearchInput } from '@/components/elements';

export function ActionTableJobsWidget() {
  const { jobsQueryState, setJobsQueryFilterState } = useJobsQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterJob = pathname.includes('jobs');

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
              initValue={jobsQueryState.filters.title || ''}
              onHandleSearch={(keyword) => {
                setJobsQueryFilterState({ title: keyword });
              }}
            />
          </GridItem>
        </Grid>
        {isShowFilterJob && (
          <>
            <Spacer />
            <AddNewJobWidget>
              <Button leftIcon={<>+</>}>Create</Button>
            </AddNewJobWidget>
          </>
        )}
      </HStack>
    </Box>
  );
}
