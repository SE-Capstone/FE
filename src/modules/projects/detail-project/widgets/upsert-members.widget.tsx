import { useEffect, useRef, useState } from 'react';

import { Button, HStack, Stack } from '@chakra-ui/react';
import { isEqual } from 'lodash-es';

import { UsersAsyncSelect } from '../components/users-async-select';
import { useUpsertMembersHook } from '../hooks/mutations';

import type { IOptionUserSelect } from '../components/users-async-select';

import { CustomFormProvider, ModalBase } from '@/components/elements';
import { notify } from '@/libs/helpers';

export interface UpsertMembersWidgetProps {
  children: React.ReactElement;
  projectId: string;
  defaultUserValue: string[];
  defaultUsersOption: IOptionUserSelect[];
}

export function UpsertMembersWidget(props: UpsertMembersWidgetProps) {
  const { children, defaultUserValue, defaultUsersOption, projectId } = props;

  const { data, formUpsertMembers, handleUpsertMembers, isLoading, reset } = useUpsertMembersHook();
  const [selectedOptions, setSelectedOptions] = useState<IOptionUserSelect[]>(defaultUsersOption);

  const usersChecked = useRef<string[]>([]);
  useEffect(() => {
    if (!isEqual(usersChecked.current, defaultUserValue)) {
      usersChecked.current = defaultUserValue;
    }
    if (!isEqual(selectedOptions, defaultUsersOption)) {
      setSelectedOptions(defaultUsersOption);
    }
  }, [defaultUserValue, defaultUsersOption, selectedOptions]);

  // const resetForm = () => {
  //   setSelectedOptions(defaultUsersOption);
  //   usersChecked.current = defaultUserValue;
  // };

  const handleSubmit = () => {
    if (isLoading) return;

    handleUpsertMembers({
      projectId,
      memberIds: Array.from(usersChecked.current),
    });
  };

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title="Add members"
      triggerButton={() => children}
      renderFooter={() => (
        <Stack w="full" gap={2} display="flex" flexDir="row" justifyContent="end">
          <Button
            form="form-create-user"
            w={20}
            type="submit"
            isDisabled={isLoading}
            onClick={() => {
              if (!usersChecked.current.length) {
                return notify({
                  type: 'error',
                  message: 'Please choose at least one member',
                });
              }
              const selected = usersChecked.current.sort().join();
              if (selected === defaultUserValue.sort().join()) {
                return notify({
                  type: 'error',
                  message: 'Value can not be the same as old value',
                });
              }

              handleSubmit();
              return undefined;
            }}
          >
            Save
          </Button>
        </Stack>
      )}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-create-user"
        form={formUpsertMembers}
        onSubmit={handleUpsertMembers}
      >
        <Stack spacing={5}>
          <HStack align="stretch">
            <UsersAsyncSelect
              isMulti
              defaultUserValue={defaultUserValue}
              defaultValue={selectedOptions}
              onChange={(options) => {
                usersChecked.current = options.map((opt) => opt.value as string).filter(Boolean);
              }}
            />
          </HStack>
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
