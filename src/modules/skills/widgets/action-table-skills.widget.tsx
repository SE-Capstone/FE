import { Box, Button, Grid, GridItem, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useSkillsQueryFilterStateContext } from '../contexts';
import { UpsertSkillWidget } from './upsert-skill.widget';

import { SearchInput } from '@/components/elements';

export function ActionTableSkillsWidget() {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const { skillsQueryState, setSkillsQueryFilterState } = useSkillsQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterSkill = pathname.includes('skills');

  return (
    <Box p={5} py={3} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Grid
          w={{
            base: '80%',
            lg: '70%',
            xl: '60%',
          }}
          gap={2}
        >
          <GridItem colSpan={2}>
            <SearchInput
              placeholder={`${t('common.enter')} ${t('fields.title').toLowerCase()}...`}
              initValue={skillsQueryState.filters.title || ''}
              onHandleSearch={(keyword) => {
                setSkillsQueryFilterState({ title: keyword });
              }}
            />
          </GridItem>
        </Grid>
        {isShowFilterSkill && (
          <>
            <Spacer />
            <Button size="md" leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
              {t('common.create')}
            </Button>
            <UpsertSkillWidget isOpen={disclosureModal.isOpen} onClose={disclosureModal.onClose} />
          </>
        )}
      </HStack>
    </Box>
  );
}
