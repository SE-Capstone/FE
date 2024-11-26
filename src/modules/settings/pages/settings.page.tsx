/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';

import { Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { CustomTabs, Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { PermissionEnum } from '@/configs';
import { Error403Page } from '@/modules/errors';
import { ListDefaultLabelPage } from '@/modules/labels/pages/list-default-label.page';
import { useAuthentication } from '@/modules/profile/hooks';
import { ListDefaultStatusPage } from '@/modules/statuses/pages/list-default-status.page';

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { permissions } = useAuthentication();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(() =>
    parseInt(localStorage.getItem('activeSettingTabIndex') || '0', 10)
  );

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  useEffect(() => {
    localStorage.setItem('activeSettingTabIndex', activeTabIndex.toString());
  }, [activeTabIndex]);

  if (
    !permissions[PermissionEnum.READ_DEFAULT_LABEL] &&
    !permissions[PermissionEnum.READ_DEFAULT_STATUS]
  ) {
    return <Error403Page />;
  }

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
            isSelected={activeTabIndex}
            tabsData={[
              permissions[PermissionEnum.READ_DEFAULT_LABEL] && {
                title: i18n.language === 'vi' ? t('common.label') : t('common.labels'),
                childrenPanel: <ListDefaultLabelPage />,
              },
              permissions[PermissionEnum.READ_DEFAULT_STATUS] && {
                title: i18n.language === 'vi' ? t('common.status') : t('common.statuses'),
                childrenPanel: <ListDefaultStatusPage />,
              },
            ].filter(Boolean)}
            onTabChange={handleTabChange}
          />
        </StateHandler>
      </Container>
    </>
  );
}
