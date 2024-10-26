import { Box, Button, Grid, GridItem, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { UpsertProjectWidget } from './upsert-project.widget';
import { useProjectsQueryFilterStateContext } from '../contexts';

import type { IUser } from '@/modules/users/list-user/types';

import { CustomChakraReactSelect, SearchInput } from '@/components/elements';
import { PermissionEnum, PROJECT_STATUS_OPTIONS, PROJECT_VISIBILITY_OPTIONS } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ActionTableProjectsWidget({ teamLeads }: { teamLeads: IUser[] }) {
  const { t } = useTranslation();
  const { permissions } = useAuthentication();
  const disclosureModal = useDisclosure();
  const { projectsQueryState, setProjectsQueryFilterState } = useProjectsQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterProject = pathname.includes(APP_PATHS.listProject);

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
              placeholder="Enter name/code..."
              initValue={projectsQueryState.filters.search || ''}
              onHandleSearch={(keyword) => {
                setProjectsQueryFilterState({ search: keyword });
              }}
            />
          </GridItem>
          <GridItem
            colSpan={{
              base: 2,
              md: 1,
            }}
          >
            <CustomChakraReactSelect
              isSearchable={false}
              size="sm"
              placeholder="Choose status"
              options={PROJECT_STATUS_OPTIONS}
              onChange={(opt) => {
                setProjectsQueryFilterState({
                  status: opt?.value ? opt.value : undefined,
                });
              }}
            />
          </GridItem>
          <GridItem
            colSpan={{
              base: 2,
              md: 1,
            }}
          >
            <CustomChakraReactSelect
              isSearchable={false}
              size="sm"
              placeholder="Choose visible status"
              options={PROJECT_VISIBILITY_OPTIONS}
              onChange={(opt) => {
                setProjectsQueryFilterState({
                  isVisible: opt?.value ? opt.value === 'true' : undefined,
                });
              }}
            />
          </GridItem>
        </Grid>
        {isShowFilterProject && permissions[PermissionEnum.ADD_PROJECT] && (
          <>
            <Spacer />
            <Button leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
              {t('common.create')}
            </Button>
            <UpsertProjectWidget
              isOpen={disclosureModal.isOpen}
              teamLeads={teamLeads}
              onClose={disclosureModal.onClose}
            />
          </>
        )}
      </HStack>
    </Box>
  );
}
