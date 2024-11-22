import { Box, Button, Grid, GridItem, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useApplicantsQueryFilterStateContext } from '../contexts';
import { UpsertApplicantWidget } from './upsert-applicant.widget';

import { SearchInput } from '@/components/elements';

export function ActionTableApplicantsWidget() {
  const { t } = useTranslation();
  const { applicantsQueryState, setApplicantsQueryFilterState } =
    useApplicantsQueryFilterStateContext();
  const { pathname } = useLocation();
  const disclosureModal = useDisclosure();

  const isShowFilterApplicant = pathname.includes('applicants');

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
              placeholder={`${t('common.enter')} ${t('fields.name').toLowerCase()}`}
              initValue={applicantsQueryState.filters.search || ''}
              onHandleSearch={(keyword) => {
                setApplicantsQueryFilterState({ search: keyword });
              }}
            />
          </GridItem>
          <GridItem
            colSpan={{
              base: 2,
              md: 1,
            }}
          >
            {/* <CustomChakraReactSelect
              isSearchable={false}
              placeholder="Choose priority"
              options={ISSUE_PRIORITY_OPTIONS}
              onChange={(opt) => {
                setApplicantsQueryFilterState({
                  priority: opt?.value ? opt.value : undefined,
                });
              }}
            /> */}
          </GridItem>
          <GridItem
            colSpan={{
              base: 2,
              md: 1,
            }}
          >
            {/* <CustomChakraReactSelect
              isSearchable={false}
              placeholder="Choose label"
              options={ISSUE_PRIORITY_OPTIONS}
              onChange={(opt) => {
                setApplicantsQueryFilterState({
                  priority: opt?.value ? opt.value : undefined,
                });
              }}
            /> */}
          </GridItem>
        </Grid>
        {isShowFilterApplicant && (
          <>
            <Spacer />
            <Button leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
              {t('common.create')}
            </Button>
            <UpsertApplicantWidget
              isOpen={disclosureModal.isOpen}
              onClose={disclosureModal.onClose}
            />
          </>
        )}
      </HStack>
    </Box>
  );
}
