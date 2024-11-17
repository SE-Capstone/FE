import { Box, Button, Grid, GridItem, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useRolesQueryFilterStateContext } from '../contexts';

import { SearchInput } from '@/components/elements';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ActionTableRolesWidget() {
  const { t } = useTranslation();
  const { rolesQueryState, setRolesQueryFilterState } = useRolesQueryFilterStateContext();

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
              placeholder={`${t('common.enter')} ${t('fields.name').toLowerCase()}...`}
              initValue={rolesQueryState.filters.name || ''}
              onHandleSearch={(keyword) => {
                setRolesQueryFilterState({ name: keyword });
              }}
            />
          </GridItem>
        </Grid>

        <Button as={Link} to={APP_PATHS.createRole} size="md" leftIcon={<>+</>}>
          {t('common.create')}
        </Button>
      </HStack>
    </Box>
  );
}
