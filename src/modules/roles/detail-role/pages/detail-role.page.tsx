import React, { useState } from 'react';

import { Button, Checkbox, Stack } from '@chakra-ui/react';

function PermissionGroup({ group, onPermissionChange, initiallySelectedPermissions }) {
  // Initialize checked permissions based on initiallySelectedPermissions
  const [checkedPermissions, setCheckedPermissions] = React.useState(
    group.permissions.map((permission) => initiallySelectedPermissions.includes(permission.id))
  );

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
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={handleParentChange}
      >
        {group.name}
      </Checkbox>
      <Stack pl={6} mt={1} spacing={1}>
        {group.permissions.map((permission, index) => (
          <Checkbox
            key={permission.id}
            isChecked={checkedPermissions[index]}
            onChange={handleChildChange(index)}
          >
            {permission.name}
          </Checkbox>
        ))}
      </Stack>
    </>
  );
}

export function DetailRolePage() {
  const groups = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afaz',
      name: 'Group 1',
      permissions: [
        { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Permission 1' },
        { id: '3fa85f64-5717-4562-b3fc-2c963f66afaa', name: 'Permission 2' },
      ],
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afaw',
      name: 'Group 2',
      permissions: [
        { id: '3fa85f64-5717-4562-b3fc-2c963f66afae', name: 'Permission 3' },
        { id: '3fa85f64-5717-4562-b3fc-2c963f66afax', name: 'Permission 4' },
      ],
    },
  ];

  const initiallySelectedPermissions = [
    '3fa85f64-5717-4562-b3fc-2c963f66afaa', // Permission 2
    '3fa85f64-5717-4562-b3fc-2c963f66afax', // Permission 4
  ];

  // Initialize selectedPermissions with initiallySelectedPermissions
  const [selectedPermissions, setSelectedPermissions] = React.useState(
    new Set(initiallySelectedPermissions)
  );

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

  // Handle form submission
  const handleSubmit = () => {
    console.log('Submitted Permission IDs:', Array.from(selectedPermissions));
  };

  return (
    <>
      {groups.map((group) => (
        <PermissionGroup
          key={group.id}
          group={group}
          initiallySelectedPermissions={Array.from(selectedPermissions)}
          onPermissionChange={handlePermissionChange}
        />
      ))}
      <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
}
