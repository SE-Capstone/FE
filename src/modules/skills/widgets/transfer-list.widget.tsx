/* eslint-disable max-params */
import { useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  VStack,
  HStack,
  Text,
  Heading,
  Skeleton,
  Stack,
  Box,
  Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  MdClose,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdSearch,
} from 'react-icons/md';

import { useGetListUserSkills } from '../apis/get-list-user-skills.api';
import { useUpsertUserSkillsHook } from '../hooks/mutations/use-upsert-user-skills.mutation.hooks';

import type { ISkill } from '../types';

import { CustomInput } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { notify } from '@/libs/helpers';
import { useAuthentication } from '@/modules/profile/hooks';

export default function TransferListWidget({
  skills,
  userId,
  isLoading,
}: {
  skills: ISkill[];
  userId: string | null;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  const { permissions } = useAuthentication();
  const [leftItems, setLeftItems] = useState<ISkill[]>(skills);
  const [rightItems, setRightItems] = useState<ISkill[]>([]);
  const [leftChecked, setLeftChecked] = useState<ISkill[]>([]);
  const [rightChecked, setRightChecked] = useState<ISkill[]>([]);
  const [oldSkills, setOldSkills] = useState<ISkill[]>([]);
  const [leftSearchTerm, setLeftSearchTerm] = useState('');
  const [rightSearchTerm, setRightSearchTerm] = useState('');
  const { handleUpsertUserSkills, isLoading: isSubmitting } = useUpsertUserSkillsHook({
    userId: userId || '',
  });

  const { listSkill: userSkill, isLoading: isLoadingUserSkills } = useGetListUserSkills({
    userId: userId || '',
  });

  useEffect(() => {
    setOldSkills(userSkill);
    setRightItems(userSkill);
  }, [userSkill]);

  useEffect(() => {
    if (userId && !isLoadingUserSkills && !isLoading) {
      const o = new Set(oldSkills.map((item) => item.id));
      setLeftItems(skills.filter((item) => !o.has(item.id)));
    } else {
      setLeftItems(skills);
    }
    setLeftChecked([]);
    setRightChecked([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, skills, oldSkills]);

  const handleToggle = (setChecked, checked, item) => {
    const updatedChecked = checked.includes(item)
      ? checked.filter((i) => i !== item)
      : [...checked, item];
    setChecked(updatedChecked);
  };

  const moveItems = (_fromItems, setFromItems, _toItems, setToItems, checkedItems, setChecked) => {
    setToItems((prev) => [...prev, ...checkedItems]);
    setFromItems((prev) => prev.filter((item) => !checkedItems.includes(item)));
    setChecked([]);
  };

  const moveAllItems = (fromItems, setFromItems, _toItems, setToItems, setChecked) => {
    setToItems((prev) => [...prev, ...fromItems]);
    setFromItems([]);
    setChecked([]);
  };

  const filteredLeftItems = leftItems.filter((item) =>
    item.title.toLowerCase().includes(leftSearchTerm.toLowerCase())
  );
  const filteredRightItems = rightItems.filter((item) =>
    item.title.toLowerCase().includes(rightSearchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!userId) {
      notify({
        type: 'error',
        message: 'Please select a user',
      });
    }

    handleUpsertUserSkills({
      oldUserSkills: oldSkills,
      newUserSkills: rightItems,
    });
  };

  const customList = (items, checked, setChecked, searchTerm, setSearchTerm, isLeft = true) => (
    <>
      <CustomInput
        placeholder={`${t('common.enter')} ${t('common.skill').toLowerCase()}...`}
        value={searchTerm}
        my={0}
        minH="32px"
        maxH="32px"
        bg="white"
        h="32px"
        borderColor="gray.300"
        rightIcon={
          <Box h="32px">
            {searchTerm ? (
              <Icon
                as={MdClose}
                boxSize={4.5}
                cursor="pointer"
                onClick={() => (isLeft ? setLeftSearchTerm('') : setRightSearchTerm(''))}
              />
            ) : (
              <Icon as={MdSearch} boxSize={4.5} cursor="default" />
            )}
          </Box>
        }
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <VStack
        align="start"
        p={3}
        minW="320px"
        maxW="320px"
        minHeight="500px"
        maxHeight="500px"
        overflow="auto"
        rounded={2.5}
        bg="white"
        shadow="md"
      >
        {isLoading || isLoadingUserSkills ? (
          <>
            {[...Array(10)].map((_, index) => (
              <Stack key={index} spacing={3} direction="row" align="center" w="full">
                <Checkbox isDisabled />
                <Skeleton flex={1} height="15px" w="full" />
              </Stack>
            ))}
          </>
        ) : items.length === 0 ? (
          <Text fontSize="md" textAlign="center" w="full">
            {t('common.noData')}
          </Text>
        ) : (
          items.map((item) => (
            <Checkbox
              key={item.id}
              size="md"
              borderColor="gray.300"
              disabled={!userId || !permissions[PermissionEnum.UPSERT_SKILL_USER]}
              isChecked={checked.includes(item)}
              onChange={() => handleToggle(setChecked, checked, item)}
            >
              <Text noOfLines={2}>{item.title}</Text>
            </Checkbox>
          ))
        )}
      </VStack>
    </>
  );

  return (
    <>
      <HStack spacing={4} align="start" alignItems="center">
        <VStack>
          <Heading size="md">{t('common.skills')}</Heading>
          {customList(
            filteredLeftItems,
            leftChecked,
            setLeftChecked,
            leftSearchTerm,
            setLeftSearchTerm
          )}
        </VStack>

        <VStack>
          <Button
            disabled={
              leftItems.length === 0 ||
              !userId ||
              isSubmitting ||
              !permissions[PermissionEnum.UPSERT_SKILL_USER]
            }
            onClick={() =>
              moveAllItems(leftItems, setLeftItems, rightItems, setRightItems, setLeftChecked)
            }
          >
            <MdOutlineKeyboardDoubleArrowRight />
          </Button>
          <Button
            disabled={
              leftChecked.length === 0 ||
              !userId ||
              isSubmitting ||
              !permissions[PermissionEnum.UPSERT_SKILL_USER]
            }
            onClick={() =>
              moveItems(
                leftItems,
                setLeftItems,
                rightItems,
                setRightItems,
                leftChecked,
                setLeftChecked
              )
            }
          >
            <MdOutlineKeyboardArrowRight />
          </Button>
          <Button
            disabled={
              rightChecked.length === 0 ||
              !userId ||
              isSubmitting ||
              !permissions[PermissionEnum.UPSERT_SKILL_USER]
            }
            onClick={() =>
              moveItems(
                rightItems,
                setRightItems,
                leftItems,
                setLeftItems,
                rightChecked,
                setRightChecked
              )
            }
          >
            <MdOutlineKeyboardArrowLeft />
          </Button>
          <Button
            disabled={
              rightItems.length === 0 ||
              !userId ||
              isSubmitting ||
              !permissions[PermissionEnum.UPSERT_SKILL_USER]
            }
            onClick={() =>
              moveAllItems(rightItems, setRightItems, leftItems, setLeftItems, setRightChecked)
            }
          >
            <MdOutlineKeyboardDoubleArrowLeft />
          </Button>
        </VStack>

        <VStack>
          <Heading size="md">{t('common.selectedSkill')}</Heading>
          {customList(
            filteredRightItems,
            rightChecked,
            setRightChecked,
            rightSearchTerm,
            setRightSearchTerm,
            false
          )}
        </VStack>
      </HStack>
      <Button
        disabled={!userId || isSubmitting || !permissions[PermissionEnum.UPSERT_SKILL_USER]}
        px={6}
        mt={4}
        onClick={handleSubmit}
      >
        {t('common.submit')}
      </Button>
    </>
  );
}
