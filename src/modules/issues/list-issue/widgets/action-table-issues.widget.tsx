import { Box, Button, Grid, GridItem, HStack, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { AddNewIssueWidget } from './add-new-issue.widget';
import { useIssuesQueryFilterStateContext } from '../contexts';

import { CustomChakraReactSelect, SearchInput } from '@/components/elements';
import { ISSUE_PRIORITY_OPTIONS } from '@/configs';

export function ActionTableIssuesWidget() {
  const { t } = useTranslation();
  const { issuesQueryState, setIssuesQueryFilterState } = useIssuesQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterIssue = pathname.includes('issues');

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
              placeholder="Enter name/code..."
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
              placeholder="Choose priority"
              options={ISSUE_PRIORITY_OPTIONS}
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
              placeholder="Choose label"
              options={ISSUE_PRIORITY_OPTIONS}
              onChange={(opt) => {
                setIssuesQueryFilterState({
                  priority: opt?.value ? opt.value : undefined,
                });
              }}
            />
          </GridItem>
        </Grid>
        {isShowFilterIssue && (
          <>
            <Spacer />
            <AddNewIssueWidget>
              <Button leftIcon={<>+</>}>{t('common.create')}</Button>
            </AddNewIssueWidget>
          </>
        )}
      </HStack>
    </Box>
  );
}
