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
      <Button
        // bg={type === 'error' ? 'red.600' : 'primary'}
        // _hover={{
        //   bg: type === 'error' ? 'red.600' : 'primary',
        //   opacity: 0.8,
        // }}
        // ml={3}
        // isLoading={isLoading}
        // isDisabled={isLoading}
        {...getSubmitButtonProps()}
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
        // isDisabled={isLoading}
        {...getCancelButtonProps()}
      >
        Close
      </Button>
    </ButtonGroup>
  ) : (
    <Flex justifyContent="start">
      <IconButton aria-label="edit" size="sm" icon={<RiEditFill />} {...getEditButtonProps()} />
    </Flex>
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
      <EditRow title="Name">
        <Editable textAlign="start" defaultValue={role?.name || ''} isPreviewFocusable={false}>
          <EditablePreview />

          <CustomInput
            isRequired
            placeholder="Enter full name"
            as={EditableInput}
            // registration={register('fullName')}
            // error={errors?.fullName}
          />
          <EditableControls />
        </Editable>
      </EditRow>
      <ListPermissionWidget
        role={role}
        groupPermissions={groupPermissions}
        isLoading={isLoading || isRoleDetailLoading}
        isError={!!isError || !!isRoleDetailError}
      />
    </Stack>
  );
}
