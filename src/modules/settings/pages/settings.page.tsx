/* eslint-disable react/jsx-no-useless-fragment */
import { Container } from '@chakra-ui/react';

import { CustomTabs, Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { ListDefaultLabelPage } from '@/modules/labels/pages/list-default-label.page';
import { ListDefaultStatusPage } from '@/modules/statuses/pages/list-default-status.page';

export function SettingsPage() {
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
            title="Settings"
          >
            <></>
          </LayoutBack>
          <CustomTabs
            tabListProps={{
              bg: 'transparent',
            }}
            tabsData={[
              {
                title: 'Labels',
                childrenPanel: <ListDefaultLabelPage />,
              },
              {
                title: 'Status',
                childrenPanel: <ListDefaultStatusPage />,
              },
            ]}
          />
        </StateHandler>
      </Container>
    </>
  );
}
