import { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { GrUserExpert } from 'react-icons/gr';
import { RiEditFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import type { IRole } from '../../list-role/types';
import type { CreateRoleFormType } from '../../list-role/validations/create-role.validation';
import type { IGroupPermission } from '../apis/get-permissions.api';
import type { GroupPermissionEnum, PermissionEnum } from '@/configs';
import type { UseFormReturn } from 'react-hook-form';

import { Head } from '@/components/elements';
import { getGroupPermission, getPermission } from '@/configs';

export interface PermissionsGroupComponentProps {
  isDisabled: boolean;
  group: IGroupPermission;
  initiallySelectedPermissions: string[];
  onPermissionChange(permissions: string[], isChecked: boolean): void;
}

function PermissionGroup({
  isDisabled,
  group,
  initiallySelectedPermissions,
  onPermissionChange,
}: PermissionsGroupComponentProps) {
  const { t } = useTranslation();
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
    <AccordionItem border="none">
      <Stack direction="row" alignItems="center" w="full">
        <Checkbox
          isChecked={allChecked}
          borderColor="gray.300"
          isIndeterminate={isIndeterminate}
          isDisabled={isDisabled}
          onChange={handleParentChange}
        >
          <AccordionButton pl={1} border="none">
            <Stack direction="row" alignItems="center">
              <GrUserExpert color="gray" size={16} />
              <Text>{getGroupPermission(t, group.name as GroupPermissionEnum)}</Text>
            </Stack>
            <AccordionIcon />
          </AccordionButton>
        </Checkbox>
      </Stack>
      <AccordionPanel px={1} py={1}>
        <Stack pl={8} spacing={2} direction="row" alignItems="stretch">
          <Box width="1px" bg="gray.300" />
          <Stack spacing={1}>
            {group.permissions.map((permission, index) => (
              <Checkbox
                key={permission.id}
                borderColor="gray.300"
                paddingLeft={3}
                isDisabled={isDisabled}
                isChecked={checkedPermissions[index]}
                onChange={handleChildChange(index)}
              >
                <Text key={permission.id}>
                  {getPermission(t, permission.name as PermissionEnum)}
                </Text>
              </Checkbox>
            ))}
          </Stack>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}

function InitPermissionGroup({ group }: { group: IGroupPermission }) {
  const { t } = useTranslation();
  return (
    <Stack direction="column" alignItems="start">
      <Stack direction="row" alignItems="center">
        <GrUserExpert color="gray" size={16} />
        <Text>{getGroupPermission(t, group.name as GroupPermissionEnum)}</Text>
      </Stack>

      <Stack pl={8} spacing={2} direction="row" alignItems="stretch">
        <Box width="1px" bg="gray.300" />
        <Stack spacing={1}>
          {group.permissions.map((permission) => (
            <Text key={permission.id} paddingLeft={3}>
              {getPermission(t, permission.name as PermissionEnum)}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

export function ListPermissionWidget({
  role,
  form,
  isLoading,
  groupPermissions,
  isError,
  mutation,
  isDisabled,
  triggerClose,
  isCreate,
  isEditable,
}: {
  form?: UseFormReturn<CreateRoleFormType>;
  role?: IRole;
  groupPermissions: IGroupPermission[];
  isLoading: boolean;
  isError: boolean;
  mutation?: any;
  isDisabled: boolean;
  triggerClose?: boolean;
  isCreate?: boolean;
  isEditable?: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Initialize selectedPermissions with initiallySelectedPermissions
  const [selectedPermissions, setSelectedPermissions] = useState(new Set<string>());
  const [initialPermissions, setInitialPermissions] = useState<Set<string>>(new Set());
  const [initialGroups, setInitialGroups] = useState<IGroupPermission[]>([]);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (role) {
      const permissions = new Set(role.permissions.map((permission) => permission.id));
      setSelectedPermissions(permissions);
      setInitialPermissions(permissions); // Set the initial permissions
    }
    setPermissionsLoaded(true);
  }, [role]);

  useEffect(() => {
    setIsEditing(false);
  }, [triggerClose]);

  useEffect(() => {
    const filteredGroups = groupPermissions
      .map((g) => {
        const filteredPermissions = g.permissions.filter((p) => initialPermissions.has(p.id));
        // Only include the group if it has at least one permission that matches
        if (filteredPermissions.length > 0) {
          return { ...g, permissions: filteredPermissions };
        }
        return null;
      })
      .filter((g): g is IGroupPermission => g !== null); // Ensure null values are filtered out

    setInitialGroups(filteredGroups);
  }, [initialPermissions, groupPermissions]);

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
    if (isCreate && form) {
      form.setValue('permissionsId', Array.from(selectedPermissions));
    } else {
      setInitialPermissions(new Set(selectedPermissions)); // Reset initial state after saving
      mutation(selectedPermissions);
    }
  };

  return (
    <>
      <Head title="Detail role" />
      <Stack bg="white" pt={2} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
        {!isLoading && isError ? (
          <Flex my={4} justify="center">
            <Text>{t('common.noData')}</Text>
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
            <Accordion
              allowToggle
              defaultIndex={0}
              maxW={{
                base: '100%',
                md: '100%',
                lg: '60%',
              }}
              display="flex"
            >
              <AccordionItem border="1px solid" borderColor="gray.300" borderRadius="md" flex={1}>
                <h2>
                  <AccordionButton bg="gray.100" borderBottom="1px solid" borderColor="gray.300">
                    <Box as="span" flex="1" textAlign="left">
                      {t('fields.permission')}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} maxH="800px" overflow="scroll">
                  <Box p={3}>
                    {isEditing || isCreate
                      ? groupPermissions.map((group, _index) => (
                          <Accordion key={group.id} allowMultiple>
                            <PermissionGroup
                              key={group.id}
                              group={group}
                              isDisabled={isDisabled}
                              initiallySelectedPermissions={Array.from(selectedPermissions)}
                              onPermissionChange={handlePermissionChange}
                            />
                          </Accordion>
                        ))
                      : initialGroups.map((group) => (
                          <InitPermissionGroup key={group.id} group={group} />
                        ))}
                  </Box>
                </AccordionPanel>
              </AccordionItem>
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
                hidden={isEditing || isCreate || isEditable}
                onClick={() => setIsEditing(!isEditing)}
              />
            </Accordion>

            <Stack direction="row" mt={4}>
              <Button
                hidden={isLoading || (!isEditing && !isCreate)}
                w="fit-content"
                type="submit"
                isDisabled={!hasChanges() || isDisabled} // Disable if no changes
                onClick={handleSubmit}
              >
                {t('common.save')}
              </Button>
              <Button
                variant="ghost"
                hidden={!isCreate}
                isDisabled={isDisabled}
                w="fit-content"
                onClick={() => navigate(-1)}
              >
                {t('common.back')}
              </Button>
              <Button
                variant="ghost"
                hidden={isLoading || !isEditing || isCreate}
                isDisabled={isDisabled}
                w="fit-content"
                onClick={() => setIsEditing(false)}
              >
                {t('common.cancel')}
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
}
