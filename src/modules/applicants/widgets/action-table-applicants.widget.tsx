import { Box, Button, Grid, GridItem, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useApplicantsQueryFilterStateContext } from '../contexts';
import { UpsertApplicantWidget } from './upsert-applicant.widget';

import { SearchInput } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';

export function ActionTableApplicantsWidget() {
  const { t } = useTranslation();
  const { applicantsQueryState, setApplicantsQueryFilterState } =
    useApplicantsQueryFilterStateContext();
  const { pathname } = useLocation();
  const { permissions } = useAuthentication();
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
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          gap={2}
        >
          <GridItem colSpan={1}>
            <SearchInput
              placeholder={`${t('common.enter')} ${t('fields.email').toLowerCase()}`}
              initValue={applicantsQueryState.filters.email || ''}
              onHandleSearch={(keyword) => {
                setApplicantsQueryFilterState({ email: keyword });
              }}
            />
          </GridItem>
          <GridItem colSpan={1}>
            <SearchInput
              placeholder={`${t('common.enter')} ${t('fields.name').toLowerCase()}`}
              initValue={applicantsQueryState.filters.name || ''}
              onHandleSearch={(keyword) => {
                setApplicantsQueryFilterState({ name: keyword });
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
        {isShowFilterApplicant && permissions[PermissionEnum.ADD_APPLICANT] && (
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
