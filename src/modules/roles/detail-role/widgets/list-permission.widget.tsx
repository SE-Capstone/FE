import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { GrUserExpert } from 'react-icons/gr';

import type { IRole } from '../../list-role/types';
import type { IGroupPermission } from '../apis/get-permissions.api';

import { Head } from '@/components/elements';

export interface PermissionsGroupComponentProps {
  group: IGroupPermission;
  initiallySelectedPermissions: string[];
  onPermissionChange(permissions: string[], isChecked: boolean): void;
}

function PermissionGroup({
  group,
  initiallySelectedPermissions,
  onPermissionChange,
}: PermissionsGroupComponentProps) {
  // Initialize checked permissions based on initiallySelectedPermissions
  const [checkedPermissions, setCheckedPermissions] = useState(
    group.permissions.map((permission) => initiallySelectedPermissions.includes(permission.id))
  );

  if (!group.permissions || group.permissions.length === 0) {
    // If no child permissions, don't render the group
    return null;
  }

  const allChecked = checkedPermissions.every(Boolean);
  const isIndeterminate = checkedPermissions.some(Boolean) && !allChecked;

  // Handle the change in parent checkbox
  const handleParentChange = (e) => {
    const { checked } = e.target;
    const newCheckedPermissions = group.permissions.map(() => checked);
    setCheckedPermissions(newCheckedPermissions);

    // Update selected permissions in parent component
    onPermissionChange(
      group.permissions.map((permission) => permission.id),
      checked
    );
  };

  // Handle the change in child checkboxes
  const handleChildChange = (index) => (e) => {
    const newCheckedPermissions = [...checkedPermissions];
    newCheckedPermissions[index] = e.target.checked;
    setCheckedPermissions(newCheckedPermissions);

    // Update selected permissions in parent component
    onPermissionChange([group.permissions[index].id], e.target.checked);
  };

  return (
    <>
      <Stack direction="row" alignItems="center">
        <Checkbox
          isChecked={allChecked}
          borderColor="gray.300"
          isIndeterminate={isIndeterminate}
          onChange={handleParentChange}
        >
          <Stack direction="row" alignItems="center">
            <GrUserExpert color="gray" size={16} />
            <Text>{group.name}</Text>
          </Stack>
        </Checkbox>
      </Stack>
      <Stack pl={8} mt={1} spacing={2} direction="row" alignItems="stretch">
        <Box width="1px" bg="gray.300" />
        <Stack spacing={1}>
          {group.permissions.map((permission, index) => (
            <Checkbox
              key={permission.id}
              borderColor="gray.300"
              paddingLeft={3}
              isChecked={checkedPermissions[index]}
              onChange={handleChildChange(index)}
            >
              {permission.name}
            </Checkbox>
          ))}
        </Stack>
      </Stack>
    </>
  );
}

export function ListPermissionWidget({
  role,
  isLoading,
  groupPermissions,
  isError,
}: {
  role?: IRole;
  groupPermissions: IGroupPermission[];
  isLoading: boolean;
  isError: boolean;
}) {
  // Initialize selectedPermissions with initiallySelectedPermissions
  const [selectedPermissions, setSelectedPermissions] = useState(new Set<string>());
  const [initialPermissions, setInitialPermissions] = useState<Set<string>>(new Set());
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  useEffect(() => {
    if (role) {
      const permissions = new Set(role.permissions.map((permission) => permission.id));
      setSelectedPermissions(permissions);
      setInitialPermissions(permissions); // Set the initial permissions
      setPermissionsLoaded(true);
    }
  }, [role]);

  // Handle changes to the selected permissions
  const handlePermissionChange = (permissionIds, isChecked) => {
    setSelectedPermissions((prevSelectedPermissions) => {
      const updatedPermissions = new Set(prevSelectedPermissions);

      permissionIds.forEach((id) => {
        if (isChecked) {
          updatedPermissions.add(id);
        } else {
          updatedPermissions.delete(id);
        }
      });

      return updatedPermissions;
    });
  };

  const hasChanges = () =>
    selectedPermissions.size !== initialPermissions.size ||
    [...selectedPermissions].some((id) => !initialPermissions.has(id));

  const handleSubmit = () => {
    console.log('Submitted Permission IDs:', Array.from(selectedPermissions));
    setInitialPermissions(new Set(selectedPermissions)); // Reset initial state after saving
  };

  return (
    <>
      <Head title="Detail role" />
      <Container maxW="container.2xl">
        <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
          {!isLoading && isError ? (
            <Flex my={4} justify="center">
              <Text>No data</Text>
            </Flex>
          ) : isLoading || !permissionsLoaded ? (
            <>
              {[...Array(3)].map((_, index) => (
                <Stack key={index}>
                  <Stack direction="row" alignItems="center" spacing={4}>
                    <SkeletonCircle size="5" />
                    <SkeletonText noOfLines={1} width="100px" />
                  </Stack>
                  <Stack pl={12} mt={2} spacing={2}>
                    {[...Array(3)].map((_, index) => (
                      <Stack key={index} direction="row" alignItems="center" spacing={4}>
                        <SkeletonCircle size="5" />
                        <SkeletonText noOfLines={1} width="80px" />
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </>
          ) : (
            <>
              {groupPermissions.map((group) => (
                <PermissionGroup
                  key={group.id}
                  group={group}
                  initiallySelectedPermissions={Array.from(selectedPermissions)}
                  onPermissionChange={handlePermissionChange}
                />
              ))}
              <Button
                hidden={isLoading}
                w="fit-content"
                mt={4}
                isDisabled={!hasChanges()} // Disable if no changes
                onClick={handleSubmit}
              >
                Save
              </Button>
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}
