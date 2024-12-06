import { useEffect, useMemo } from 'react';

import { Button, SimpleGrid, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { BadgeStatus } from '../../detail-project/components';
import { useUpsertProjectHook } from '../../detail-project/hooks/mutations/use-upsert-project.mutation.hooks';

import type { IProject } from '../types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomOptionComponentChakraReactSelect,
  CustomSingleValueComponentChakraReactSelect,
  CustomTextArea,
  ModalBase,
} from '@/components/elements';
import { PROJECT_STATUS_OPTIONS, UserStatusEnum } from '@/configs';
import { formatDate } from '@/libs/helpers';
import { useDebounce } from '@/libs/hooks';
import { useGetInfiniteUserQuery } from '@/modules/users/list-user/hooks/queries';

export interface UpsertProjectWidgetProps {
  isUpdate?: boolean;
  project?: IProject;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertProjectWidget(props: UpsertProjectWidgetProps) {
  const { t } = useTranslation();
  const { isUpdate, project, isOpen, onClose } = props;

  const { formUpsertProject, handleUpsertProject, isLoading, reset } = useUpsertProjectHook({
    id: project?.id,
    isUpdate,
    onClose,
  });

  const {
    control,
    register,
    formState: { errors, isDirty },
    reset: resetForm,
  } = formUpsertProject;

  useEffect(() => {
    if (project) {
      resetForm(
        {
          name: project.name,
          code: project.code,
          totalEffort: project.totalEffort,
          description: project.description,
          startDate: project.startDate
            ? (formatDate({
                date: project.startDate,
                format: 'YYYY-MM-DD',
              }) as unknown as Date)
            : undefined,
          endDate: project.endDate
            ? (formatDate({
                date: project.endDate,
                format: 'YYYY-MM-DD',
              }) as unknown as Date)
            : undefined,
          status: project.status,
          leadId: project.leadId || '',
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [project, resetForm]);

  const [inputValue, setInputValue] = useDebounce('');

  const variables = {
    filter: {
      userName: inputValue ? inputValue.toLocaleLowerCase() : undefined,
      status: UserStatusEnum.Active,
    },
  };

  const {
    isLoading: isLoading2,
    hasMore,
    listUser,
    fetchMore,
    isFetching,
    isRefetching,
  } = useGetInfiniteUserQuery({
    params: variables.filter,
  });

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const handleMenuScrollToBottom = () => {
    if (!hasMore || isFetching || isRefetching) return;
    fetchMore();
  };

  const customComponents = useMemo(
    () => ({
      Option: (props) => CustomOptionComponentChakraReactSelect(props, 'sm'),
      SingleValue: (props) => CustomSingleValueComponentChakraReactSelect(props, false),
    }),
    []
  );

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-project"
          w={20}
          type="submit"
          isDisabled={
            isLoading || (isUpdate && !isDirty) || isLoading2 || isFetching || isRefetching
          }
        >
          {t('common.save')}
        </Button>
      )}
      title={
        isUpdate
          ? `${t('common.update')} ${t('common.project').toLowerCase()}`
          : `${t('common.create')} ${t('common.project').toLowerCase()}`
      }
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-upsert-project"
        form={formUpsertProject}
        onSubmit={handleUpsertProject}
      >
        <Stack spacing={5}>
          <CustomInput
            label={t('fields.name')}
            isRequired
            registration={register('name')}
            error={errors.name}
          />
          <CustomInput
            label={t('fields.code')}
            isRequired
            registration={register('code')}
            error={errors.code}
          />
          <CustomTextArea
            label={t('fields.description')}
            isRequired
            registration={register('description')}
            error={errors.description}
          />
          <SimpleGrid columns={2} spacing={3}>
            <CustomInput
              label={t('fields.startDate')}
              type="date"
              registration={register('startDate')}
              error={errors.startDate}
            />
            <CustomInput
              label={t('fields.endDate')}
              type="date"
              registration={register('endDate')}
              error={errors.endDate}
            />
          </SimpleGrid>
          <SimpleGrid columns={2} spacing={3}>
            <CustomInput
              label={t('fields.totalEffort')}
              type="number"
              maxH="40px"
              registration={register('totalEffort')}
              error={errors.totalEffort}
            />
            <CustomChakraReactSelect
              isSearchable
              placeholder={`${t('common.choose')} ${t('fields.teamLead').toLowerCase()}`}
              label={t('fields.teamLead')}
              size="md"
              options={listUser.map((user) => ({
                label: user.userName,
                value: user.id,
                image: user.avatar || '',
              }))}
              control={control}
              name="leadId"
              components={customComponents}
              onInputChange={handleInputChange}
              onMenuScrollToBottom={handleMenuScrollToBottom}
            />
          </SimpleGrid>
          {isUpdate && (
            <CustomChakraReactSelect
              isSearchable
              isRequired
              placeholder={`${t('common.choose')} ${t('common.status').toLowerCase()}`}
              label={t('common.status')}
              size="lg"
              options={PROJECT_STATUS_OPTIONS.map((s) => ({
                label: <BadgeStatus status={s} />,
                value: s,
              }))}
              control={control}
              name="status"
            />
          )}
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
