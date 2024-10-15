import { Button, Stack, Text } from '@chakra-ui/react';

import { useRemoveLabelMutation } from '../apis/delete-label.api';
import { removeLabelFormSchema } from '../validations/remove-label.validations';

import type { ILabel } from '../types';
import type { RemoveLabelFormValues } from '../validations/remove-label.validations';

import { CustomChakraReactSelect, CustomFormProvider, ModalBase } from '@/components/elements';
import { useFormWithSchema } from '@/libs/hooks';

export interface RemoveLabelWidgetProps {
  listLabel: ILabel[];
  label: ILabel;
  isOpen: boolean;
  onClose: () => void;
}

export function RemoveLabelWidget(props: RemoveLabelWidgetProps) {
  const { label, listLabel, isOpen, onClose } = props;

  const formRemoveLabel = useFormWithSchema({
    schema: removeLabelFormSchema,
  });

  const {
    control,
    formState: { isDirty },
    reset,
  } = formRemoveLabel;

  const { mutate, isPending: isLoading } = useRemoveLabelMutation({ closeAlert: onClose });

  function onSubmit(values: RemoveLabelFormValues) {
    if (isLoading) return;

    mutate({
      body: {
        ...values,
        id: label.id,
      },
    });
  }

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-label"
          w={20}
          type="submit"
          bg="red.600"
          _hover={{
            bg: 'red.600',
            opacity: 0.8,
          }}
          isDisabled={isLoading || !isDirty}
        >
          Delete
        </Button>
      )}
      title="Delete label"
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider id="form-upsert-label" form={formRemoveLabel} onSubmit={onSubmit}>
        <Stack spacing={5}>
          <Text>
            Your project has {label.issueCount} {`"${label.title}"`} issues. Before you can delete
            this issue type, change {`"${label.title}"`} issues to another type.
          </Text>
          <CustomChakraReactSelect
            isSearchable
            placeholder="Choose label"
            label={`Change all existing "${label.title}" issues to`}
            size="lg"
            options={listLabel
              .filter((l) => l.id !== label.id)
              .map((label) => ({
                label: `${label.title}`,
                value: label.id,
              }))}
            control={control}
            name="newLabelId"
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
