import React from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';

import type { ModalBaseCommonProps, ModalExternalState, ModalInternalState } from '../modal-base';
import type { DrawerProps } from '@chakra-ui/react';

export type DrawerBaseProps = Partial<DrawerProps> &
  ModalBaseCommonProps &
  (ModalInternalState | ModalExternalState);

export function DrawerBase({
  title,
  children,
  isLoading = false,
  renderFooter,
  triggerButton,
  overlayProps,
  onBeforeTrigger,
  isDone,
  isOpen: isOpenExternal,
  onClose: onCloseExternal,
  onOpen: onOpenExternal,
  ...restDrawerProps
}: DrawerBaseProps) {
  const disClosurePropsInternal = useDisclosure();
  const {
    isOpen: isOpenInternal,
    onClose: onCloseInternal,
    onOpen: onOpenInternal,
  } = disClosurePropsInternal;

  const disClosureProps = {
    isOpen: isOpenExternal ?? isOpenInternal,
    onClose: onCloseExternal ?? onCloseInternal,
    onOpen: onOpenExternal ?? onOpenInternal,
  };

  const { isOpen, onClose, onOpen } = disClosureProps;

  const trigger =
    triggerButton && typeof triggerButton === 'function'
      ? React.cloneElement(triggerButton(disClosureProps), {
          onClick: () => {
            onBeforeTrigger && onBeforeTrigger(disClosureProps);
            onOpen();
          },
        })
      : null;

  React.useEffect(() => {
    if (isDone) {
      onClose();
    }
  }, [isDone, onClose]);

  const titleRender = typeof title === 'function' ? title(disClosureProps) : title;

  const footerRender =
    typeof renderFooter === 'function' ? renderFooter(disClosureProps) : renderFooter;

  return (
    <>
      {trigger}
      <Drawer
        size="md"
        closeOnOverlayClick={!isLoading}
        closeOnEsc
        isFullHeight
        {...restDrawerProps}
        isOpen={isOpen ?? false}
        onClose={onClose}
      >
        <DrawerOverlay bg="rgba(0, 0, 0, 0.6)" {...overlayProps} />
        <DrawerContent pb="24px">
          <DrawerHeader
            pt="40px"
            fontWeight="semibold"
            fontSize={{ base: 'md', lg: 'lg', xl: 'xl' }}
            lineHeight="39px"
            display="flex"
          >
            {titleRender}
          </DrawerHeader>
          <DrawerCloseButton mt="30px" isDisabled={isLoading} onClick={onClose} />
          <DrawerBody>{children}</DrawerBody>
          {renderFooter && <DrawerFooter mt={3}>{footerRender}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    </>
  );
}
