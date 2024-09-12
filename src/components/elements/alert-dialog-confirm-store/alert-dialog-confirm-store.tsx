import React from 'react';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

import { useAlertDialogStore } from '@/contexts';

export const AlertDialogConfirmStore = () => {
  const cancelRef = React.useRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>;

  const { state, closeAlert } = useAlertDialogStore();

  const {
    title,
    description,
    textConfirm,
    type,
    isOpenAlert,
    onHandleConfirm,
    isLoading,
    dialogProps,
  } = state;

  return isOpenAlert ? (
    <AlertDialog
      isCentered
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      isOpen={isOpenAlert}
      onClose={closeAlert}
      {...dialogProps}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="semibold">
          {title}
        </AlertDialogHeader>

        <AlertDialogBody>{description}</AlertDialogBody>

        <AlertDialogFooter>
          <Button
            ref={cancelRef}
            variant="ghost"
            border="1px"
            borderColor="transparent"
            color="textColor"
            _hover={{
              borderColor: 'primary',
            }}
            isDisabled={isLoading}
            onClick={closeAlert}
          >
            Cancel
          </Button>
          <Button
            minW="80px"
            bg={type === 'error' ? 'red.600' : 'primary'}
            _hover={{
              bg: type === 'error' ? 'red.600' : 'primary',
              opacity: 0.8,
            }}
            ml={3}
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={onHandleConfirm}
          >
            {textConfirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
};
