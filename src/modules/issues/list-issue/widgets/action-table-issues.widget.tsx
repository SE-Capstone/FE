import { Box, Button, Grid, GridItem, HStack, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AddNewIssueWidget } from './add-new-issue.widget';
import { PriorityIssue } from '../components';
import { useIssuesQueryFilterStateContext } from '../contexts';

import type { ILabel } from '@/modules/labels/types';

import { CustomChakraReactSelect, SearchInput } from '@/components/elements';
import { ISSUE_PRIORITY_OPTIONS } from '@/configs';

export function ActionTableIssuesWidget({ listLabel }: { listLabel: ILabel[] }) {
  const { t } = useTranslation();
  const { issuesQueryState, setIssuesQueryFilterState } = useIssuesQueryFilterStateContext();

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
              placeholder={`${t('common.enter')} ${t('fields.subject').toLowerCase()}...`}
              initValue={issuesQueryState.filters.subject || ''}
              onHandleSearch={(keyword) => {
                setIssuesQueryFilterState({ subject: keyword });
              }}
            />
          </GridItem>
          <GridItem
            colSpan={{
              base: 2,
              md: 1,
            }}
          >
            <CustomChakraReactSelect
              isSearchable={false}
              size="sm"
              placeholder={`${t('common.choose')} ${t('fields.priority').toLowerCase()}`}
              options={ISSUE_PRIORITY_OPTIONS.map((value) => ({
                label: <PriorityIssue priority={value} />,
                value,
              }))}
              onChange={(opt) => {
                setIssuesQueryFilterState({
                  priority: opt?.value ? opt.value : undefined,
                });
              }}
            />
          </GridItem>
          <GridItem
            colSpan={{
              base: 2,
              md: 1,
            }}
          >
            <CustomChakraReactSelect
              isSearchable={false}
              size="sm"
              placeholder={`${t('common.choose')} ${t('common.label').toLowerCase()}`}
              options={listLabel.map((label) => ({
                label: label.title,
                value: label.id,
              }))}
              onChange={(opt) => {
                setIssuesQueryFilterState({
                  labelId: opt?.value ? opt.value : undefined,
                });
              }}
            />
          </GridItem>
        </Grid>
        <Spacer />
        <AddNewIssueWidget>
          <Button leftIcon={<>+</>}>{t('common.create')}</Button>
        </AddNewIssueWidget>
        <Link to="issues/create">{t('common.create')}</Link>
      </HStack>
    </Box>
  );
}
