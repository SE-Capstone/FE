import { Menu, MenuButton, MenuItem, MenuList, Stack, StackDivider } from '@chakra-ui/react';

import type { MenuButtonProps, MenuItemProps, MenuListProps, MenuProps } from '@chakra-ui/react';

export interface IActionMenuItems {
  label: React.ReactNode;
  icon?: React.ReactElement;
  onClick?: () => void;
  menuItemProps?: MenuItemProps;
}

export interface ActionMenuTableProps extends Omit<MenuProps, 'children'> {
  children: (props: {
    isOpen: boolean;
    onClose: () => void;
    forceUpdate: (() => void) | undefined;
  }) => React.ReactNode;

  actionMenuItems: IActionMenuItems[];

  menuButtonProps?: MenuButtonProps;

  menuListProps?: MenuListProps;
}

export function ActionMenuTable({
  children,
  actionMenuItems = [],
  menuListProps,
  menuButtonProps,
  ...menuProps
}: ActionMenuTableProps) {
  return (
    <Menu isLazy strategy="fixed" {...menuProps}>
      {(props) => {
        const childrenRender = typeof children === 'function' ? children(props) : children;
        return (
          <>
            <MenuButton aria-label="Actions" {...menuButtonProps}>
              {childrenRender}
            </MenuButton>
            <MenuList
              as={Stack}
              sx={{
                boxShadow: '0px 4px 10px rgba(142, 150, 175, 0.3)',
              }}
              rounded="8px"
              border="none"
              py={0}
              overflow="hidden"
              {...menuListProps}
              spacing={0}
              divider={<StackDivider borderColor="gray.200" />}
            >
              {actionMenuItems.map(({ label, icon, onClick, menuItemProps }, index) => (
                <MenuItem
                  key={label?.toString() + index.toString()}
                  isDisabled={menuItemProps?.isDisabled}
                  icon={icon}
                  color="textColor"
                  fontWeight={500}
                  fontSize="14px"
                  px={4}
                  py={3}
                  _hover={{
                    color: 'primary',
                    bg: 'gray.50',
                  }}
                  onClick={onClick}
                  {...menuItemProps}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </>
        );
      }}
    </Menu>
  );
}
