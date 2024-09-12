import React from 'react';

import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  SkeletonText,
  useEditableControls,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { RiEditFill } from 'react-icons/ri';

import type { FieldWrapperProps } from '../field-wrapper';
import type { InputProps } from '@chakra-ui/react';

import { EditRow } from '@/components/widgets';

function EditableControls({
  isLoading,
  isDisabled,
  onSubmit,
}: {
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
}) {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup mt={2} justifyContent="start" size="sm">
      <Button
        {...getSubmitButtonProps()}
        isLoading={isLoading}
        isDisabled={isLoading || isDisabled}
        onClick={onSubmit}
      >
        Save
      </Button>
      <Button
        {...getCancelButtonProps()}
        variant="ghost"
        border="1px"
        borderColor="transparent"
        color="textColor"
        _hover={{
          borderColor: 'primary',
        }}
        isDisabled={isLoading || isDisabled}
      >
        Close
      </Button>
    </ButtonGroup>
  ) : (
    <IconButton
      {...getEditButtonProps()}
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
    />
  );
}

export interface CustomEditableInputProps extends InputProps, FieldWrapperProps {
  isLoading: boolean;
  isUpdating: boolean;
  title: string;
  initialValue: string;
  inputChildren: React.ReactElement;
  onSubmit: () => void;
}

export const CustomEditableInput = (props: CustomEditableInputProps) => {
  const { isLoading, title, initialValue, inputChildren, isUpdating, onSubmit } = props;
  const { handleSubmit } = useFormContext();
  return (
    <EditRow
      title={title}
      stackProps={{
        maxW: 25,
        justifyContent: 'end',
        alignSelf: 'start',
      }}
    >
      {isLoading ? (
        <SkeletonText mt="4" noOfLines={1} width="200px" />
      ) : (
        <Editable textAlign="start" defaultValue={initialValue} isPreviewFocusable={false}>
          {({ isEditing }) => (
            <>
              <EditablePreview
                maxW={{
                  base: '100%',
                  md: '100%',
                  lg: '60%',
                }}
              />
              {isEditing &&
                React.cloneElement(inputChildren, {
                  as: EditableInput,
                  maxW: {
                    base: '100%',
                    md: '100%',
                    lg: '60%',
                  },
                })}
              <EditableControls
                isLoading={isLoading}
                isDisabled={isUpdating}
                onSubmit={handleSubmit(onSubmit)}
              />
            </>
          )}
        </Editable>
      )}
    </EditRow>
  );
};
