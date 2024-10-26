import { Box, Button, Grid, GridItem, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useJobsQueryFilterStateContext } from '../contexts';
import { UpsertJobWidget } from './upsert-job.widget';

import { SearchInput } from '@/components/elements';

export function ActionTableJobsWidget() {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const { jobsQueryState, setJobsQueryFilterState } = useJobsQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterJob = pathname.includes('jobs');

  return (
    <Box p={5} py={3} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
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
            <Button size="md" leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
              {t('common.create')}
            </Button>
            <UpsertJobWidget isOpen={disclosureModal.isOpen} onClose={disclosureModal.onClose} />
          </>
        )}
      </HStack>
    </Box>
  );
}
