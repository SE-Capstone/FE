import { Menu, Button, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FaAngleDown } from 'react-icons/fa';

import type { MaybeElementRenderProps } from '@/types';
import type { MenuItemProps, MenuProps, MenuListProps, MenuButtonProps } from '@chakra-ui/react';

interface IMenuState {
  isOpen: boolean;
  onClose: () => void;
  forceUpdate: (() => void) | undefined;
}

interface MenuItemElement extends MenuItemProps {
  label: MaybeElementRenderProps<IMenuState>;
}

export interface CustomMenuProps extends Omit<MenuProps, 'children'> {
  menuItemElements: MenuItemElement[];
  menuListProps?: MenuListProps;
  menuButtonProps?: MenuButtonProps;

  title: MaybeElementRenderProps<IMenuState>;

  iconOpen?: React.ReactElement;
}

export function CustomMenu({
  title,
  iconOpen = <FaAngleDown />,
  menuItemElements = [],
  menuListProps,
  menuButtonProps,
  ...menuProps
}: CustomMenuProps) {
  return (
    <Menu isLazy strategy="fixed" {...menuProps}>
      {(props) => {
        const { isOpen } = props;
        const titleRender = typeof title === 'function' ? title(props) : title;
        return (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              variant="unstyled"
              w="auto"
              h="auto"
              display="flex"
              alignItems="center"
              rightIcon={iconOpen}
              {...menuButtonProps}
            >
              {titleRender}
            </MenuButton>

            <MenuList py={0} {...menuListProps}>
              {menuItemElements.map(({ label, ...menuItemProps }, index) => {
                const labelRender = typeof label === 'function' ? label(props) : label;

                return (
                  <MenuItem key={index} {...menuItemProps}>
                    {labelRender}
                  </MenuItem>
                );
              })}
            </MenuList>
          </>
        );
      }}
    </Menu>
  );
}
