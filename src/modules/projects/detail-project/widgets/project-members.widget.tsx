import { useEffect, useState } from 'react';

import { Button, Icon, IconButton, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { PiUsersThreeFill } from 'react-icons/pi';
import { RiEditFill } from 'react-icons/ri';

import { UpsertMembersWidget } from './upsert-members.widget';

import type { IProject } from '../../list-project/types';
import type { IOptionUserSelect } from '../components/users-async-select';

export function ProjectMembersWidget({ project }: { project?: IProject }) {
  const { t } = useTranslation();
  const hasMembers = (project?.members?.length || 0) > 0 || !!project?.leadId;

  const [initialMembers, setInitialMembers] = useState<Set<string>>(new Set());
  const [defaultUsersOption, setDefaultUsersOption] = useState<IOptionUserSelect[]>([]);

  useEffect(() => {
    const tempDefaultUsers: IOptionUserSelect[] = [];
    const members = new Set(project?.members?.map((m) => m.id));
    project?.members?.map((member) =>
      tempDefaultUsers.push({
        value: member.id,
        label: `${member.fullName} (${member.userName})`,
        image: '',
      })
    );
    if (project?.leadId) {
      members.add(project.leadId);
    }

    setDefaultUsersOption(tempDefaultUsers);
    setInitialMembers(members);
  }, [project]);

  return (
    <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} spacing={3}>
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
        {hasMembers && (
          <UpsertMembersWidget
            defaultUserValue={Array.from(initialMembers)}
            defaultUsersOption={defaultUsersOption}
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
          <Text wordBreak="break-all" whiteSpace="normal" flex={1} fontWeight={500}>
            {project?.leadName} (Leader)
          </Text>
          {project?.members.map((member, index) => (
            <Text key={index} wordBreak="break-all" whiteSpace="normal" flex={1} fontWeight={500}>
              {member.userName} ({member.positionName})
            </Text>
          ))}
        </Stack>
      ) : (
        <UpsertMembersWidget
          defaultUserValue={Array.from(initialMembers)}
          defaultUsersOption={defaultUsersOption}
          projectId={project?.id || ''}
        >
          <Button width="fit-content" leftIcon={<>+</>}>
            {`${t('common.add')} ${t('fields.members').toLowerCase()}`}
          </Button>
        </UpsertMembersWidget>
      )}
    </Stack>
  );
}
