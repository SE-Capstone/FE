import { Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useGetGroupPermissions } from '../../detail-role/apis/get-permissions.api';
import { ListPermissionWidget } from '../../detail-role/widgets/list-permission.widget';
import { useCreateRoleHook } from '../hooks/mutations';

import { CustomFormProvider, CustomInput, CustomTextArea } from '@/components/elements';
import { EditRow } from '@/components/widgets';

export function CreateRolePage() {
  const { t } = useTranslation();
  const { groupPermissions, isError, isLoading } = useGetGroupPermissions();
  const { form, handleCreateRole, isLoading: isCreating } = useCreateRoleHook();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
      <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={handleCreateRole}>
        <EditRow
          title={t('fields.name')}
          stackProps={{
            maxW: 25,
            justifyContent: 'end',
            alignSelf: 'start',
          }}
        >
          <CustomInput
            maxW={{
              base: '100%',
              md: '100%',
              lg: '60%',
            }}
            isRequired
            placeholder={`${t('common.enter')} ${t('fields.name')}`}
            registration={register('name')}
            error={errors.name}
          />
        </EditRow>
        <EditRow
          title={t('fields.description')}
          stackProps={{
            maxW: 25,
            justifyContent: 'end',
            alignSelf: 'start',
          }}
        >
          <CustomTextArea
            mt={2}
            maxW={{
              base: '100%',
              md: '100%',
              lg: '60%',
            }}
            isRequired
            placeholder={`${t('common.enter')} ${t('fields.description')}`}
            registration={register('description')}
            error={errors.description}
          />
        </EditRow>
        <EditRow
          title={t('fields.permission')}
          stackProps={{
            maxW: 25,
            justifyContent: 'end',
            alignSelf: 'start',
          }}
        >
          <ListPermissionWidget
            groupPermissions={groupPermissions}
            isLoading={isLoading}
            isError={!!isError}
            isDisabled={isCreating}
            form={form}
            isCreate
          />
        </EditRow>
      </CustomFormProvider>
    </Stack>
  );
}
