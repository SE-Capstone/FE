import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Stack,
  useEditableControls,
} from '@chakra-ui/react';
import { RiEditFill } from 'react-icons/ri';
import { useParams } from 'react-router-dom';

import { useGetGroupPermissions } from '../apis/get-permissions.api';
import { useGetRole } from '../apis/get-role-detail.api';
import { ListPermissionWidget } from '../widgets/list-permission.widget';

import { CustomInput } from '@/components/elements';
import { EditRow } from '@/components/widgets';

function EditableControls() {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup mt={2} justifyContent="start" size="sm">
      <Button {...getSubmitButtonProps()}>Save</Button>
      <Button
        variant="ghost"
        border="1px"
        borderColor="transparent"
        color="textColor"
        _hover={{
          borderColor: 'primary',
        }}
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

export function DetailRolePage() {
  const { roleId } = useParams();
  const {
    role,
    isError: isRoleDetailError,
    isLoading: isRoleDetailLoading,
  } = useGetRole({ roleId: roleId || '' });
  const { groupPermissions, isError, isLoading } = useGetGroupPermissions();

  return (
    <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
      {/* <EditRow title="Name"> */}
      <Editable textAlign="start" defaultValue={role?.name} isPreviewFocusable={false}>
        {({ isEditing }) => (
          <>
            <EditablePreview />
            {isEditing && (
              <CustomInput
                title="Role Name"
                isRequired
                placeholder="Enter full name"
                as={EditableInput}
              />
            )}
            <EditableControls />
          </>
        )}
        {/* <EditablePreview />

        <CustomInput
          title="abc"
          isRequired
          placeholder="Enter full name"
          as={EditableInput}
          // hidden={EditableInput}
          // registration={register('fullName')}
          // error={errors?.fullName}
        />
        <EditableControls /> */}
      </Editable>
      {/* </EditRow> */}
      <ListPermissionWidget
        role={role}
        groupPermissions={groupPermissions}
        isLoading={isLoading || isRoleDetailLoading}
        isError={!!isError || !!isRoleDetailError}
      />
    </Stack>
  );
}
