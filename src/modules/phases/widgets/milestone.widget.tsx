import { useEffect, useState } from 'react';

import {
  Box,
  chakra,
  Container,
  Text,
  HStack,
  VStack,
  Flex,
  useColorModeValue,
  useBreakpointValue,
  Skeleton,
  Tooltip,
  Stack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdOutlineArrowRightAlt } from 'react-icons/md';

import { ActionMenuTablePhases } from './action-menu-table-phases';

import type { IPhase } from '../types';

import { formatDate, isDateLessThan } from '@/libs/helpers';

interface MilestoneProps {
  phases: IPhase[];
  isLoading: boolean;
}

const LineWithDot = ({ phase }: { phase?: IPhase }) => {
  const { t } = useTranslation();
  const [isLate, setIsLate] = useState<boolean>(false);

  useEffect(() => {
    if (phase && phase?.actualEndDate) {
      setIsLate(isDateLessThan({ date1: phase.expectedEndDate, date2: phase.actualEndDate }));
    }
  }, [phase]);

  const isDone = !!phase?.actualEndDate;
  const isRunning = !!phase?.actualStartDate && !phase?.actualEndDate;

  return (
    <Flex
      pos="relative"
      alignItems="center"
      mr={{ base: '40px', md: '40px' }}
      ml={{ base: '0', md: '40px' }}
    >
      <chakra.span
        position="absolute"
        left="50%"
        height="calc(100% + 10px)"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        top="0px"
      />
      <Box pos="relative" p="10px">
        <Tooltip
          label={
            isDone && phase ? (
              <Stack>
                <Text color="white">{isLate ? t('common.late') : t('common.onTime')}</Text>
                <Text color="white">
                  {formatDate({
                    date: phase.actualEndDate!,
                    format: 'MMM DD, YYYY',
                  })}
                </Text>
              </Stack>
            ) : isRunning ? (
              <Text color="white">{t('common.runningPhase')}</Text>
            ) : (
              ''
            )
          }
        >
          <Box
            pos="absolute"
            top="0"
            left="0"
            bottom="0"
            right="0"
            width="100%"
            height="100%"
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            backgroundPosition="center center"
            bg={
              !isDone
                ? isRunning
                  ? 'indicator.500'
                  : 'gray.500'
                : isLate
                ? 'indicator.200'
                : 'indicator.100'
            }
            borderRadius="100px"
            backgroundImage="none"
            opacity={1}
          />
        </Tooltip>
      </Box>
    </Flex>
  );
};

const EmptyCard = () => <Box flex={{ base: 0, md: 1 }} p={{ base: 0, md: 6 }} bg="transparent" />;

const Card = ({ phase, index }: { phase: IPhase; index: number }) => {
  const { title, description, expectedStartDate, expectedEndDate } = phase;

  // For even id show card on left side
  // For odd id show card on right side
  const isEvenId = index % 2 === 0;
  let borderWidthValue = isEvenId ? '15px 15px 15px 0' : '15px 0 15px 15px';
  let leftValue = isEvenId ? '-15px' : 'unset';
  let rightValue = isEvenId ? 'unset' : '-15px';

  const isMobile = useBreakpointValue({ base: true, md: false });
  if (isMobile) {
    leftValue = '-15px';
    rightValue = 'unset';
    borderWidthValue = '15px 15px 15px 0';
  }

  return (
    <HStack
      flex={1}
      p={{ base: 3, sm: 6 }}
      bg={useColorModeValue('gray.100', 'gray.800')}
      spacing={5}
      rounded="lg"
      alignItems="center"
      pos="relative"
      _before={{
        content: `""`,
        w: '0',
        h: '0',
        borderColor: `transparent ${useColorModeValue('#edf2f6', '#1a202c')} transparent`,
        borderStyle: 'solid',
        borderWidth: borderWidthValue,
        position: 'absolute',
        left: leftValue,
        right: rightValue,
        display: 'block',
      }}
    >
      <Box w="full">
        <Flex flex="1" gap="4" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Text fontSize="lg" color={isEvenId ? 'teal.400' : 'blue.400'} display="flex">
            {formatDate({
              date: expectedStartDate,
              format: 'MMM DD, YYYY',
            })}
            <MdOutlineArrowRightAlt />
            {formatDate({ date: expectedEndDate, format: 'MMM DD, YYYY' })}
          </Text>

          <ActionMenuTablePhases phase={phase} />
        </Flex>

        <VStack spacing={2} mb={3} textAlign="left">
          <chakra.h1 fontSize="2xl" lineHeight={1.2} fontWeight="bold" w="100%">
            {title}
          </chakra.h1>
          <Text fontSize="md" w="full">
            {description}
          </Text>
        </VStack>
      </Box>
    </HStack>
  );
};

const SkeletonCard = () => (
  <HStack
    flex={1}
    p={{ base: 3, sm: 6 }}
    bg={useColorModeValue('gray.100', 'gray.800')}
    spacing={5}
    rounded="lg"
    alignItems="center"
    pos="relative"
  >
    <Box>
      <Skeleton height="20px" width="100px" mb={2} />
      <VStack spacing={2} mb={3} textAlign="left">
        <Skeleton height="30px" width="200px" />
        <Skeleton height="20px" width="300px" />
      </VStack>
    </Box>
  </HStack>
);

const Milestones = ({ phases, isLoading }: MilestoneProps) => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <Container maxW="full" p={{ base: 2, sm: 10 }} bg="white" mx={0} borderRadius={3}>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <Flex key={index} mb="10px">
            {isDesktop && <EmptyCard />}
            <LineWithDot />
            <SkeletonCard />
            {isDesktop && <EmptyCard />}
          </Flex>
        ))
      ) : phases.length > 0 ? (
        phases.map((milestone, _index) => (
          <Flex key={milestone.id} mb="10px">
            {/* Desktop view(left card) */}
            {isDesktop && (_index + 1) % 2 === 0 && (
              <>
                <EmptyCard />
                <LineWithDot phase={milestone} />
                <Card phase={milestone} index={_index + 1} />
              </>
            )}

            {/* Mobile view */}
            {isMobile && (
              <>
                <LineWithDot phase={milestone} />
                <Card phase={milestone} index={_index + 1} />
              </>
            )}

            {/* Desktop view(right card) */}
            {isDesktop && (_index + 1) % 2 !== 0 && (
              <>
                <Card phase={milestone} index={_index + 1} />

                <LineWithDot phase={milestone} />
                <EmptyCard />
              </>
            )}
          </Flex>
        ))
      ) : (
        <Flex my={1} justify="center">
          <Text fontSize="lg" color="gray.600">
            {t('common.noData')}
          </Text>
        </Flex>
      )}
    </Container>
  );
};

export default Milestones;
