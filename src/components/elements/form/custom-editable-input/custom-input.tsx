import React from 'react';

import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  forwardRef,
  useEditableControls,
  useMediaQuery,
} from '@chakra-ui/react';
import { RiEditFill } from 'react-icons/ri';

import type { FieldWrapperProps } from '../field-wrapper';
import type { InputProps } from '@chakra-ui/react';

import { EditRow } from '@/components/widgets';

function EditableControls({ isLoading }: { isLoading: boolean }) {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup mt={2} justifyContent="start" size="sm">
      <Button ml={3} isLoading={isLoading} isDisabled={isLoading} {...getSubmitButtonProps()}>
        Save
      </Button>
      <Button
        variant="ghost"
        border="1px"
        borderColor="transparent"
        color="textColor"
        _hover={{
          borderColor: 'primary',
        }}
        isDisabled={isLoading}
        {...getCancelButtonProps()}
      >
        Close
      </Button>
    </ButtonGroup>
  ) : (
    <IconButton
      aria-label="edit"
      bg="transparent"
      size="sm"
      ml={2}
      display="inline-block"
      color="gray.400"
      _hover={{
        color: 'gray.500',
        background: 'transparent',
      }}
      icon={<RiEditFill />}
      {...getEditButtonProps()}
    />
  );
}

export interface CustomEditableInputProps extends InputProps, FieldWrapperProps {
  isLoading: boolean;
  title: string;
  initialValue: string;
  inputChildren: React.ReactElement;
}

export const CustomEditableInput = forwardRef<CustomEditableInputProps, 'input'>((props) => {
  const { isLoading, title, initialValue, inputChildren } = props;

  return (
    <EditRow
      title={title}
      stackProps={{
        maxW: 20,
        justifyContent: 'end',
      }}
    >
      <Editable textAlign="start" defaultValue={initialValue} isPreviewFocusable={false}>
        {({ isEditing }) => (
          <>
            <EditablePreview />
            {isEditing &&
              React.cloneElement(inputChildren, {
                as: EditableInput,
              })}
            <EditableControls isLoading={isLoading} />
          </>
        )}
      </Editable>
    </EditRow>
  );
});
