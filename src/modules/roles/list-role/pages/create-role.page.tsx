import { Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useGetGroupPermissions } from '../../detail-role/apis/get-permissions.api';
import { ListPermissionWidget } from '../../detail-role/widgets/list-permission.widget';
import { useCreateRoleHook } from '../hooks/mutations';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomTextArea,
} from '@/components/elements';
import { EditRow } from '@/components/widgets';
import { COLOR_OPTIONS } from '@/configs';
import { BadgeIssue as BadgeRole } from '@/modules/issues/list-issue/components';

export function CreateRolePage() {
  const { t } = useTranslation();
  const { groupPermissions, isError, isLoading } = useGetGroupPermissions();
  const { form, handleCreateRole, isLoading: isCreating } = useCreateRoleHook();

  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
      <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={handleCreateRole}>
        <EditRow
          title={t('fields.name')}
          isRequired
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
          isRequired
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
          title={t('fields.theme')}
          isRequired
          stackProps={{
            maxW: 25,
            justifyContent: 'end',
            alignSelf: 'start',
          }}
        >
          <Stack
            mt={2}
            maxW={{
              base: '100%',
              md: '100%',
              lg: '60%',
            }}
          >
            <CustomChakraReactSelect
              isRequired
              placeholder={`${t('common.choose')} ${t('fields.theme').toLowerCase()}`}
              size="md"
              options={COLOR_OPTIONS.map((color) => ({
                label: <BadgeRole content="Role" colorScheme={color} />,
                value: color,
              }))}
              control={control}
              name="color"
            />
          </Stack>
        </EditRow>
        <EditRow
          title={t('fields.permission')}
          isRequired
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
