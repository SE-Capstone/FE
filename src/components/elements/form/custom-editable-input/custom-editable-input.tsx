import React, { useEffect, useState } from 'react';

import { Button, ButtonGroup, Editable, IconButton, SkeletonText, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { RiEditFill } from 'react-icons/ri';

import type { FieldWrapperProps } from '../field-wrapper';
import type { InputProps } from '@chakra-ui/react';

import { EditRow } from '@/components/widgets';

function EditableControls({
  isLoading,
  isDisabled,
  isDirty,
  onSubmit,
  onClose,
  onEdit,
  isEditing,
  isDefaultRole,
}: {
  isLoading: boolean;
  isDisabled: boolean;
  isDirty: boolean;
  onSubmit: () => void;
  onClose: () => void;
  onEdit: () => void;
  isEditing: boolean;
  isDefaultRole: boolean;
}) {
  return isEditing ? (
    <ButtonGroup mt={2} justifyContent="start" size="sm" mb={2}>
      <Button
        isLoading={isLoading}
        isDisabled={isLoading || isDisabled || isDirty}
        onClick={onSubmit}
      >
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
        isDisabled={isLoading || isDisabled}
        onClick={onClose}
      >
        Close
      </Button>
    </ButtonGroup>
  ) : (
    <IconButton
      hidden={isDefaultRole}
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
      _focus={{
        background: 'transparent',
      }}
      icon={<RiEditFill />}
      onClick={onEdit}
    />
  );
}

export interface CustomEditableInputProps extends InputProps, FieldWrapperProps {
  isLoading: boolean;
  isDisabled: boolean;
  isDirty: boolean;
  title: string;
  initialValue: string;
  inputChildren: React.ReactElement;
  triggerClose: boolean;
  isDefaultRole: boolean;
  onSubmit: () => void;
}

export const CustomEditableInput = (props: CustomEditableInputProps) => {
  const {
    isLoading,
    title,
    initialValue,
    inputChildren,
    isDisabled,
    onSubmit,
    triggerClose,
    isDirty,
    isDefaultRole,
  } = props;
  const { handleSubmit } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [triggerClose]);

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

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
          {isEditing ? (
            React.cloneElement(inputChildren, {
              maxW: {
                base: '100%',
                md: '100%',
                lg: '60%',
              },
            })
          ) : (
            <Text
              as="span"
              maxW={{
                base: '100%',
                md: '100%',
                lg: '60%',
              }}
            >
              {initialValue}
            </Text>
          )}
          <EditableControls
            isLoading={isLoading}
            isDisabled={isDisabled}
            isEditing={isEditing}
            isDirty={isDirty}
            isDefaultRole={isDefaultRole}
            onSubmit={handleSubmit(onSubmit)}
            onClose={handleClose}
            onEdit={handleEdit}
          />
        </Editable>
      )}
    </EditRow>
  );
};
