import { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Icon,
  IconButton,
  Stack,
  Text,
  Box,
  Flex,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Table,
  Tooltip,
  Image,
  useDisclosure,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { isInteger } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { BsStars } from 'react-icons/bs';
import { LuInfo } from 'react-icons/lu';
import { MdClose } from 'react-icons/md';
import { PiUsersThreeFill } from 'react-icons/pi';
import { RiEditFill } from 'react-icons/ri';

import { UpsertMembersWidget } from './upsert-members.widget';
import { useGetUserForSuggest } from '../apis/get-user-for-suggest.api';
import { useSuggestMemberMutation } from '../apis/suggest-member.api';
import { ChangePermissionStatus } from '../components/change-permission-status';
import { InlineEditPositionSelect } from '../components/editable-dropdown.widget';
import { useUpsertMembersHook } from '../hooks/mutations';

import type { IProject, ProjectMember } from '../../list-project/types';
import type { SuggestResponse } from '../apis/suggest-member.api';
import type { IOptionUserSelect } from '../components/users-async-select';

import { IMAGE_URLS } from '@/assets/images';
import { CustomInput, CustomTextArea, ModalBase } from '@/components/elements';
import { ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { notify } from '@/libs/helpers';
import { useGetListPositionQuery } from '@/modules/positions/hooks/queries';

const MemberSetting = ({ members, projectId }: { members: ProjectMember[]; projectId: string }) => {
  const { t } = useTranslation();

  const { listPosition } = useGetListPositionQuery({
    size: 100000000,
  });

  return (
    <TableContainer overflowY="auto" maxH="580px" rounded={2}>
      <Table size="sm" variant="simple" position="relative" borderRadius={2}>
        <Thead>
          <Tr>
            <Th
              color="#8E96AF"
              fontWeight={600}
              fontSize="sm"
              py={2}
              lineHeight="21px"
              textTransform="capitalize"
            >
              <Box>{t('fields.name')}</Box>
            </Th>
            <Th
              color="#8E96AF"
              fontWeight={600}
              fontSize="sm"
              py={2}
              lineHeight="21px"
              textTransform="capitalize"
            >
              <Box>{t('common.position')}</Box>
            </Th>
            <Th
              color="#8E96AF"
              fontWeight={600}
              fontSize="sm"
              py={2}
              lineHeight="21px"
              textTransform="capitalize"
            >
              <Flex alignItems="center">
                <Box>{t('fields.IsProjectConfigurator')}</Box>
                <Tooltip label={t('common.IsProjectConfigurator')}>
                  <Text ml={1} as="span" color="textColor" fontSize="17px" fontWeight="600">
                    <LuInfo />
                  </Text>
                </Tooltip>
              </Flex>
            </Th>
            <Th
              color="#8E96AF"
              fontWeight={600}
              fontSize="sm"
              py={2}
              lineHeight="21px"
              textTransform="capitalize"
              top={0}
              bg="white"
              zIndex={1}
            >
              <Flex alignItems="center">
                <Box>{t('fields.IsIssueConfigurator')}</Box>
                <Tooltip label={t('common.IsIssueConfigurator')}>
                  <Text ml={1} as="span" color="textColor" fontSize="17px" fontWeight="600">
                    <LuInfo />
                  </Text>
                </Tooltip>
              </Flex>
            </Th>
            <Th
              color="#8E96AF"
              fontWeight={600}
              fontSize="sm"
              py={2}
              lineHeight="21px"
              textTransform="capitalize"
              top={0}
              bg="white"
              zIndex={1}
            >
              <Flex alignItems="center">
                <Box>{t('fields.IsCommentConfigurator')}</Box>
                <Tooltip label={t('common.IsCommentConfiguratorTooltip')}>
                  <Text ml={1} as="span" color="textColor" fontSize="17px" fontWeight="600">
                    <LuInfo />
                  </Text>
                </Tooltip>
              </Flex>
            </Th>
          </Tr>
        </Thead>

        <Tbody rounded="12px" bg="white">
          {members &&
            members.map((user) => {
              const tdContent = (
                <>
                  <Td
                    border="none"
                    py={2}
                    isNumeric={false}
                    sx={{
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '21px',
                      color: 'textColor',
                    }}
                  >
                    {user.fullName} ({user.userName})
                  </Td>
                  <Td border="none" py={2} isNumeric={false}>
                    <InlineEditPositionSelect
                      options={listPosition.map((p) => ({
                        label: p.title,
                        value: p.id,
                      }))}
                      isSearchable
                      defaultValue={
                        user?.positionName && user?.positionId
                          ? {
                              label: user.positionName,
                              value: user.positionId,
                            }
                          : undefined
                      }
                      projectId={projectId}
                      member={user}
                    />
                  </Td>
                  <Td border="none" py={2} isNumeric={false}>
                    <ChangePermissionStatus
                      projectId={projectId}
                      initStatus={user.isConfigurator ? true : user.isProjectConfigurator || false}
                      title={
                        user?.isProjectConfigurator ? t('actions.inactive') : t('actions.active')
                      }
                      isLoading={user.isConfigurator}
                      description={
                        user?.isProjectConfigurator
                          ? t('actions.disableMemberPermission', {
                              permissionName: t('fields.IsProjectConfigurator').toLowerCase(),
                              userName: user.userName,
                            })
                          : t('actions.enableMemberPermission', {
                              permissionName: t('fields.IsProjectConfigurator').toLowerCase(),
                              userName: user.userName,
                            })
                      }
                      field="isProjectConfigurator"
                      member={user}
                    />
                  </Td>
                  <Td border="none" py={2} isNumeric={false}>
                    {user.isIssueConfigurator || false}
                    <ChangePermissionStatus
                      projectId={projectId}
                      initStatus={user.isConfigurator ? true : user.isIssueConfigurator || false}
                      title={
                        user?.isIssueConfigurator ? t('actions.inactive') : t('actions.active')
                      }
                      isLoading={user.isConfigurator}
                      description={
                        user?.isIssueConfigurator
                          ? t('actions.disableMemberPermission', {
                              permissionName: t('fields.IsIssueConfigurator').toLowerCase(),
                              userName: user.userName,
                            })
                          : t('actions.enableMemberPermission', {
                              permissionName: t('fields.IsIssueConfigurator').toLowerCase(),
                              userName: user.userName,
                            })
                      }
                      field="isIssueConfigurator"
                      member={user}
                    />
                  </Td>
                  <Td border="none" py={2} isNumeric={false}>
                    <ChangePermissionStatus
                      projectId={projectId}
                      initStatus={user.isConfigurator ? true : user.isCommentConfigurator || false}
                      title={
                        user?.isCommentConfigurator ? t('actions.inactive') : t('actions.active')
                      }
                      isLoading={user.isConfigurator}
                      description={
                        user?.isCommentConfigurator
                          ? t('actions.disableMemberPermission', {
                              permissionName: t('fields.IsCommentConfigurator').toLowerCase(),
                              userName: user.userName,
                            })
                          : t('actions.enableMemberPermission', {
                              permissionName: t('fields.IsCommentConfigurator').toLowerCase(),
                              userName: user.userName,
                            })
                      }
                      field="isCommentConfigurator"
                      member={user}
                    />
                  </Td>
                </>
              );

              return (
                <Tr
                  key={user.id}
                  _hover={{
                    bgColor: 'gray.50',
                  }}
                  cursor="pointer"
                >
                  {tdContent}
                </Tr>
              );
            })}
        </Tbody>
      </Table>
      {members && !members.length && (
        <Flex my={4} justify="center">
          <Text>{t('common.noData')}</Text>
        </Flex>
      )}
    </TableContainer>
  );
};

export function ProjectMembersWidget({ project }: { project?: IProject }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [inputMemValue, setInputMemValue] = useState(3);
  const disclosureModal = useDisclosure();
  const disclosureModalInput = useDisclosure();
  const { permissions: projectPermissions } = useProjectContext();
  const hasMembers = (project?.members?.length || 0) > 0;
  // const hasMembers = (project?.members?.length || 0) > 0 || !!project?.leadId;

  const canUpdate = projectPermissions.includes(ProjectPermissionEnum.IsMemberConfigurator);
  const { handleUpsertMembers, isLoading: isLoading2 } = useUpsertMembersHook(project?.id || '');

  const [initialMembers, setInitialMembers] = useState<Set<string>>(new Set());
  const [defaultUsersOption, setDefaultUsersOption] = useState<IOptionUserSelect[]>([]);
  const [suggestMembers, setSuggestMembers] = useState<string[]>([]);
  const [suggestedMembers, setSuggestedMembers] = useState<SuggestResponse[]>([]);

  const { isLoading, refetch } = useGetUserForSuggest({
    userInProject: Array.from(initialMembers),
  });
  const { data, mutate, isPending, isError } = useSuggestMemberMutation({
    onOpen: disclosureModal.onOpen,
  });

  useEffect(() => {
    const tempDefaultUsers: IOptionUserSelect[] = [];
    const members = new Set(project?.members?.map((m) => m.id));
    project?.members?.map((member) =>
      tempDefaultUsers.push({
        value: member.id,
        label: member.userName,
        image: member.avatar || '',
      })
    );
    if (project?.leadId) {
      members.add(project.leadId);
    }

    setDefaultUsersOption(tempDefaultUsers);
    setInitialMembers(members);
  }, [project]);

  const suggestMember = useCallback(async () => {
    if (inputMemValue && (!isInteger(inputMemValue) || inputMemValue < 1 || inputMemValue > 20)) {
      return;
    }

    try {
      const memberForSuggest = await refetch();

      if (disclosureModalInput.isOpen) {
        disclosureModalInput.onClose();
      }
      if (disclosureModal.isOpen) {
        disclosureModal.onClose();
      }
      await mutate({
        body: {
          projectName: project?.name || '',
          projectDetail: inputValue || project?.description || '',
          totalUsersNeed: inputMemValue || 3,
          userStatistics: isLoading ? [] : memberForSuggest.data?.data || [],
        },
      });
      setInputValue('');
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    disclosureModal,
    disclosureModalInput,
    isLoading,
    mutate,
    project?.description,
    project?.name,
    refetch,
  ]);

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSuggestMembers(data.data.map((item) => item.userId));
      setSuggestedMembers(data.data);
    }
  }, [data]);

  const handleRemoveMember = useCallback(
    (memberId: string) => () => {
      setSuggestMembers(suggestMembers.filter((userId) => userId !== memberId));
      setSuggestedMembers(suggestedMembers.filter((mem) => mem.userId !== memberId));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suggestedMembers]
  );

  const saveMembers = useCallback(async () => {
    const oldMembers = project?.members?.map((item) => item.id) || [];
    if (suggestMembers.length > 0) {
      try {
        const data = new Set([...oldMembers, ...suggestMembers]);
        await handleUpsertMembers({
          projectId: project?.id || '',
          memberIds: Array.from(data),
        });
        if (disclosureModal.isOpen) {
          disclosureModal.onClose();
        }
      } catch (error) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disclosureModal, isLoading2, project?.id, suggestMembers]);

  return (
    <Stack
      bg="white"
      p={5}
      flex={1}
      mt={5}
      flexBasis="10%"
      rounded={2.5}
      spacing={3}
      overflowX="auto"
    >
      <Stack
        display="flex"
        alignItems="center"
        w="full"
        flexDir="row"
        sx={{
          fontWeight: 'semibold',
          fontSize: '20px',
          lineHeight: '27px',
          paddingBottom: '24px',
          borderBottom: '1px solid',
          borderColor: 'neutral.500',
        }}
      >
        <Text
          flex={1}
          w="full"
          sx={{
            fontWeight: 'semibold',
            fontSize: '20px',
            lineHeight: '27px',
          }}
          display="flex"
          alignItems="center"
        >
          <Icon boxSize={5} color="neutral.300" mr={3} as={PiUsersThreeFill} />
          {t('fields.members')}
        </Text>
        {canUpdate && (
          <Button
            type="button"
            bg="transparent"
            color="#85B8FF"
            border="1px solid #8F7EE7"
            transition="all 0.3s"
            hidden={!canUpdate}
            disabled={isPending || isLoading}
            leftIcon={<BsStars />}
            _hover={{
              color: 'textColor',
              bg: 'linear-gradient(45deg, #B8ACF6 0%, #85B8FF 100%)',
            }}
            // onClick={suggestMember}
            onClick={disclosureModalInput.onOpen}
          >
            {t('common.suggestMember')}
          </Button>
        )}
        {hasMembers && canUpdate && (
          <UpsertMembersWidget
            defaultUserValue={Array.from(initialMembers)}
            defaultUsersOption={defaultUsersOption}
            ignoreUserId={[project?.leadId || '']}
            projectId={project?.id || ''}
          >
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
              _focus={{
                background: 'transparent',
              }}
              icon={<RiEditFill />}
            />
          </UpsertMembersWidget>
        )}
      </Stack>
      {hasMembers ? (
        <Stack>
          {/* {project?.leadId && (
            <Text wordBreak="break-all" whiteSpace="normal" flex={1} fontWeight={500}>
              {project?.leadName} (Leader)
            </Text>
          )} */}
          {/* {project?.members.map((member, index) => (
            <Text key={index} wordBreak="break-all" whiteSpace="normal" flex={1} fontWeight={500}>
              {member.userName} {member.positionName && `(${member.positionName})`}
            </Text>
          ))} */}
          {project?.members &&
          projectPermissions.includes(ProjectPermissionEnum.IsMemberConfigurator) ? (
            <MemberSetting members={project?.members} projectId={project?.id || ''} />
          ) : (
            project?.members.map((member, index) => (
              <Text key={index} wordBreak="break-all" whiteSpace="normal" flex={1} fontWeight={500}>
                {member.userName} {member.positionName && `(${member.positionName})`}
              </Text>
            ))
          )}
        </Stack>
      ) : (
        canUpdate && (
          <UpsertMembersWidget
            defaultUserValue={Array.from(initialMembers)}
            defaultUsersOption={defaultUsersOption}
            projectId={project?.id || ''}
          >
            <Button width="fit-content" leftIcon={<>+</>}>
              {`${t('common.add')} ${t('fields.members').toLowerCase()}`}
            </Button>
          </UpsertMembersWidget>
        )
      )}

      {isPending && (
        <Stack
          sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.35)',
            inset: 0,
            position: 'fixed',
            zIndex: 9999,
          }}
        >
          <Box>
            <Image transform="scale(0.5)" src={IMAGE_URLS.AiLoading} alt="Loading" />
          </Box>
        </Stack>
      )}
      <ModalBase
        size="xl"
        renderFooter={() =>
          !isError && data?.data && data?.data?.length > 0 && suggestedMembers.length > 0 ? (
            <Button
              w={20}
              type="submit"
              isDisabled={isLoading || isPending || !canUpdate}
              bg="transparent"
              color="#85B8FF"
              border="1px solid #8F7EE7"
              transition="all 0.3s"
              _hover={{
                color: 'textColor',
                bg: 'linear-gradient(45deg, #B8ACF6 0%, #85B8FF 100%)',
              }}
              onClick={saveMembers}
            >
              {t('common.save')}
            </Button>
          ) : (
            <Button
              type="button"
              bg="transparent"
              color="#85B8FF"
              border="1px solid #8F7EE7"
              transition="all 0.3s"
              hidden={!canUpdate}
              disabled={isPending}
              leftIcon={<BsStars />}
              _hover={{
                color: 'textColor',
                bg: 'linear-gradient(45deg, #B8ACF6 0%, #85B8FF 100%)',
              }}
              onClick={suggestMember}
            >
              {t('common.suggestMember')}
            </Button>
          )
        }
        closeOnOverlayClick={false}
        title={t('common.suggestMember')}
        isOpen={disclosureModal.isOpen}
        onClose={disclosureModal.onClose}
        // onCloseComplete={reset}
      >
        <Stack spacing={5}>
          {!isError && data?.data && data?.data?.length > 0 && suggestedMembers.length > 0 ? (
            <TableContainer maxW="full" overflowY="auto" maxH="580px" rounded={2}>
              <Table size="sm" position="relative" borderRadius={2}>
                <Text color="textColor">{t('common.aiContent')}</Text>
                <Tbody rounded="12px">
                  {suggestedMembers.map((member, index) => {
                    const tdContent = (
                      <>
                        <Td
                          py={2}
                          border={index + 1 === suggestedMembers.length ? 'none' : ''}
                          isNumeric={false}
                          sx={{
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '21px',
                            color: 'textColor',
                          }}
                        >
                          {member.name} {member.userName && `(${member.userName})`}
                        </Td>
                        <Td
                          py={2}
                          border={index + 1 === suggestedMembers.length ? 'none' : ''}
                          isNumeric={false}
                          sx={{
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '21px',
                            color: 'textColor',
                          }}
                          w="50px"
                        >
                          <IconButton
                            aria-label="remove-member"
                            bg="transparent"
                            color="textColor"
                            _hover={{
                              bg: 'transparent',
                            }}
                            icon={<MdClose />}
                            onClick={handleRemoveMember(member.userId)}
                          />
                        </Td>
                      </>
                    );

                    return (
                      <Tr
                        key={index}
                        _hover={{
                          bgColor: 'gray.50',
                        }}
                        cursor="pointer"
                      >
                        {tdContent}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text wordBreak="break-all" whiteSpace="normal" flex={1} fontWeight={500}>
              {t('common.noMemberMatch')}
            </Text>
          )}
        </Stack>
      </ModalBase>
      {canUpdate && (
        <ModalBase
          size="xl"
          renderFooter={() => (
            <Button
              type="button"
              bg="transparent"
              color="#85B8FF"
              border="1px solid #8F7EE7"
              transition="all 0.3s"
              hidden={!canUpdate}
              disabled={isPending}
              leftIcon={<BsStars />}
              _hover={{
                color: 'textColor',
                bg: 'linear-gradient(45deg, #B8ACF6 0%, #85B8FF 100%)',
              }}
              onClick={() => {
                if (inputValue) {
                  suggestMember();
                } else {
                  notify({
                    type: 'error',
                    message: t('validation.descriptionRequired'),
                  });
                }
              }}
            >
              {t('common.suggestMember')}
            </Button>
          )}
          closeOnOverlayClick
          title={t('common.suggestMember')}
          isOpen={disclosureModalInput.isOpen}
          onClose={disclosureModalInput.onClose}
          // onCloseComplete={reset}
        >
          <Stack spacing={5}>
            <CustomTextArea
              label={t('common.prompt')}
              isRequired
              required
              onChange={(e) => setInputValue(e.target.value)}
            />
            <CustomInput
              label={t('common.numberOfMembers')}
              required
              type="number"
              min={0}
              max={20}
              error={
                !isInteger(inputMemValue)
                  ? { message: t('validation.numberOfMembersInt'), type: 'value' }
                  : inputMemValue < 1 || inputMemValue > 20
                  ? { message: t('validation.numberOfMembers'), type: 'min' }
                  : undefined
              }
              onChange={(e) =>
                e.target.value === ''
                  ? setInputMemValue(3)
                  : setInputMemValue(Number(e.target.value))
              }
            />
          </Stack>
        </ModalBase>
      )}
    </Stack>
  );
}
