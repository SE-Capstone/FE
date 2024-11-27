import { Box, Button, Grid, GridItem, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { usePositionsQueryFilterStateContext } from '../contexts';
import { UpsertPositionWidget } from './upsert-position.widget';

import { SearchInput } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';

export function ActionTablePositionsWidget() {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const { permissions } = useAuthentication();
  const { positionsQueryState, setPositionsQueryFilterState } =
    usePositionsQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterPosition = pathname.includes('positions');

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
              placeholder={`${t('common.enter')} ${t('fields.title').toLowerCase()}...`}
              initValue={positionsQueryState.filters.title || ''}
              onHandleSearch={(keyword) => {
                setPositionsQueryFilterState({ title: keyword });
              }}
            />
          </GridItem>
        </Grid>
        {isShowFilterPosition && permissions[PermissionEnum.CREATE_POSITION] && (
          <>
            <Spacer />
            <Button size="md" leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
              {t('common.create')}
            </Button>
            <UpsertPositionWidget
              isOpen={disclosureModal.isOpen}
              onClose={disclosureModal.onClose}
            />
          </>
        )}
      </HStack>
    </Box>
  );
}
