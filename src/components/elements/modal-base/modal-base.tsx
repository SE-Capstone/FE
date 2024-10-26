import React from 'react';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import type { MaybeElementRenderProps, NeverField, RequireField } from '@/types';
import type {
  ModalContentProps,
  ModalOverlayProps,
  ModalProps,
  UseDisclosureProps,
} from '@chakra-ui/react';

export type ModalInternalState = Partial<NeverField<UseDisclosureProps>> & {
  triggerButton: (props: UseDisclosureProps) => React.ReactElement;
  onBeforeTrigger?: (props: UseDisclosureProps) => void;
};

export type ModalExternalState = RequireField<UseDisclosureProps, 'isOpen' | 'onClose'> & {
  triggerButton?: never;
  onBeforeTrigger?: never;
};

export interface ModalBaseCommonProps {
  isLoading?: boolean;
  overlayProps?: ModalOverlayProps;
  title: MaybeElementRenderProps<UseDisclosureProps>;
  description?: MaybeElementRenderProps<UseDisclosureProps>;
  children: MaybeElementRenderProps<UseDisclosureProps>;
  isDone?: boolean;
  renderFooter?: MaybeElementRenderProps<UseDisclosureProps>;

  modalContentProps?: ModalContentProps;
}

export type ModalBaseProps = Partial<Omit<ModalProps, 'children'>> &
  ModalBaseCommonProps &
  (ModalInternalState | ModalExternalState);

export function ModalBase(props: ModalBaseProps) {
  const { t } = useTranslation();
  const {
    title,
    children,
    isLoading = false,
    renderFooter,
    triggerButton,
    overlayProps,
    onBeforeTrigger,
    isDone,
    description,
    isOpen: isOpenExternal,
    onClose: onCloseExternal,
    onOpen: onOpenExternal,
    modalContentProps,
    ...restModalProps
  } = props;

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

  const childrenRender = typeof children === 'function' ? children(disClosureProps) : children;

  const footerRender =
    typeof renderFooter === 'function' ? renderFooter(disClosureProps) : renderFooter;

  const titleRender = typeof title === 'function' ? title(disClosureProps) : title;

  const descriptionRender =
    typeof description === 'function' ? description(disClosureProps) : description;

  React.useEffect(() => {
    if (isDone) {
      onClose();
    }
  }, [isDone, onClose]);

  return (
    <>
      {trigger}
      <Modal
        size="xl"
        isCentered
        closeOnOverlayClick={!isLoading}
        scrollBehavior="inside"
        {...restModalProps}
        isOpen={isOpen ?? false}
        onClose={onClose}
      >
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" {...overlayProps} />
        <ModalContent maxH={{ base: '70vh', md: '90vh' }} pb="5" {...modalContentProps}>
          <ModalHeader
            fontWeight={600}
            fontSize={{ base: 'md', lg: 'lg' }}
            lineHeight="27px"
            display="flex"
            alignItems="start"
            flexDir="column"
            justifyContent="center"
          >
            {titleRender}
            <Text>{descriptionRender}</Text>
          </ModalHeader>
          {!isLoading && <ModalCloseButton isDisabled={isLoading} onClick={onClose} />}
          <ModalBody>{childrenRender}</ModalBody>
          {renderFooter && (
            <ModalFooter justifyContent="right">
              <Stack flexDir="row">
                <Button
                  variant="ghost"
                  border="1px"
                  borderColor="transparent"
                  color="textColor"
                  isDisabled={isLoading}
                  onClick={onClose}
                >
                  {t('common.cancel')}
                </Button>
                {footerRender}
              </Stack>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
