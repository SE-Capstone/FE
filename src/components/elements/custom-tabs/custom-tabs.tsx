import type React from 'react';

import {
  Button,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useMultiStyleConfig,
  useTab,
  forwardRef,
} from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';

import type { MaybeElementRenderProps } from '@/types';
import type {
  TabListProps,
  TabPanelProps,
  TabPanelsProps,
  TabProps,
  TabsProps,
} from '@chakra-ui/react';

type CustomTabPropsRender = { isSelected: boolean } & Omit<ReturnType<typeof useTab>, 'children'>;

interface CustomTabProps extends Omit<TabProps, 'children'> {
  children: MaybeElementRenderProps<CustomTabPropsRender>;
}

export interface TabElementProps {
  title: CustomTabProps['children'];

  childrenPanel: React.ReactNode;

  tabProps?: TabProps;

  tabPanelProps?: TabPanelProps;

  link?: string;
}

export interface CustomTabsProps extends Omit<TabsProps, 'children'> {
  tabListProps?: TabListProps;
  tabPanelsProps?: TabPanelsProps;

  useWithRouter?: boolean;

  valueOutlet?: any;

  tabsData: TabElementProps[];
}

const CustomTab = forwardRef<CustomTabProps, 'button'>((props, ref) => {
  const { children, ...restProps } = props;
  const tabProps = useTab({ ...restProps, ref });
  const isSelected = !!tabProps['aria-selected'];

  const styles = useMultiStyleConfig('Tabs', tabProps);

  const childrenRender =
    typeof children === 'function' ? children({ ...tabProps, isSelected }) : children;

  return (
    <Button
      variant="unstyled"
      __css={styles.tab}
      _selected={{
        ...(styles.tab as any)?._selected,
        color: 'primary',
      }}
      _hover={{
        color: 'primary',
      }}
      p={3.5}
      fontWeight="medium"
      {...tabProps}
    >
      {childrenRender}
    </Button>
  );
});

export function CustomTabs({
  tabsData,
  tabListProps,
  tabPanelsProps,
  useWithRouter,
  valueOutlet,
  ...tabsProps
}: CustomTabsProps) {
  return (
    <Tabs isLazy w="full" h="full" {...tabsProps}>
      <TabList bg="white" roundedTop={2} {...tabListProps}>
        {tabsData.map((tab, index) => (
          <CustomTab
            key={index}
            as={tab.link ? Link : undefined}
            to={tab.link ? tab.link : undefined}
            {...tab.tabProps}
          >
            {tab.title}
          </CustomTab>
        ))}
      </TabList>
      <TabPanels bg="white" roundedBottom={2} {...tabPanelsProps}>
        {useWithRouter ? (
          <Outlet context={valueOutlet} />
        ) : (
          tabsData.map((tab, index) => (
            <TabPanel key={index} {...tab.tabPanelProps}>
              {tab.childrenPanel}
            </TabPanel>
          ))
        )}
      </TabPanels>
    </Tabs>
  );
}
