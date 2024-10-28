import { useEffect, useState } from 'react';

import { Grid, GridItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useGetListSkillQuery } from '../hooks/queries';
import TransferListWidget from '../widgets/transfer-list.widget';
import { UsersAsyncTable } from '../widgets/users-async-table-widget';

import { Head, StateHandler } from '@/components/elements';

export function AssignSkillPage() {
  const { t } = useTranslation();

  const { listSkill, meta, isError, isLoading, handlePaginate, isRefetching } =
    useGetListSkillQuery();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserSelect = (userId: string | null) => {
    setSelectedUserId(userId);
  };

  useEffect(() => {
    console.log(selectedUserId);
  }, [selectedUserId]);

  return (
    <>
      <Head title={t('common.assignSkill')} />
      <StateHandler showLoader={isLoading} showError={!!isError}>
        <Grid templateColumns="repeat(3, 1fr)" gap="6" py={3}>
          <GridItem colSpan={1}>
            <UsersAsyncTable onUserSelect={handleUserSelect} />
          </GridItem>

          <GridItem colSpan={2}>
            <TransferListWidget />
          </GridItem>
        </Grid>
      </StateHandler>
    </>
  );
}
