/* eslint-disable react/jsx-no-useless-fragment */
import { Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { CustomTabs, Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { ListDefaultLabelPage } from '@/modules/labels/pages/list-default-label.page';
import { ListDefaultStatusPage } from '@/modules/statuses/pages/list-default-status.page';

export function SettingsPage() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Head title="Settings" />
      <Container maxW="container.2xl" centerContent>
        <StateHandler>
          <LayoutBack
            display="flex"
            flexDir="row"
            bgColor="transparent"
            justify="space-between"
            alignItems="center"
            py="14px"
            px={0}
            pb={0}
            title={t('common.settings')}
          >
            <></>
          </LayoutBack>
          <CustomTabs
            tabListProps={{
              bg: 'transparent',
            }}
            tabsData={[
              {
                title: i18n.language === 'vi' ? t('common.label') : t('common.labels'),
                childrenPanel: <ListDefaultLabelPage />,
              },
              {
                title: i18n.language === 'vi' ? t('common.status') : t('common.statuses'),
                childrenPanel: <ListDefaultStatusPage />,
              },
            ]}
          />
        </StateHandler>
      </Container>
    </>
  );
}
