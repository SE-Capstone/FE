import { useEffect, useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box as BoxAtlas, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useUpsertIssueHook } from '../hooks/mutations';

import type { IIssue } from '../types';

import { formatDate } from '@/libs/helpers';

const readViewContainerStyles = xcss({
  font: 'font.body',
  margin: '0',
  wordBreak: 'break-word',
});

const InlineEditableField = ({ issue }: { issue: IIssue }) => {
  const { t } = useTranslation();
  const [editValue, setEditValue] = useState(issue.title);

  const validate = (value: string) => {
    if (value?.length === 0) {
      return t('validation.fieldRequired');
    }
    return undefined;
  };

  useEffect(() => {
    setEditValue(issue.title);
  }, [issue.title]);

  const { handleUpsertIssue } = useUpsertIssueHook(undefined, true, issue.id);

  const handleSubmit = (value: string) => {
    handleUpsertIssue({
      ...issue,
      startDate: issue.startDate
        ? (formatDate({
            date: issue.startDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date)
        : undefined,
      dueDate: issue.dueDate
        ? (formatDate({
            date: issue.dueDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date)
        : undefined,
      statusId: issue.status.id,
      labelId: issue.label?.id,
      assigneeId: issue.assignee?.id,
      priority: issue.priority,
      title: value || issue.title,
      // TODO
      // parentIssueId: issue.parentIssueId
    });
  };

  return (
    <Box>
      <InlineEdit
        defaultValue={editValue}
        editButtonLabel={editValue}
        // keepEditViewOpenOnBlur
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        editView={({ errorMessage, ...fieldProps }) => (
          <Textfield
            style={{
              fontWeight: '600',
              fontSize: '24px',
            }}
            {...fieldProps}
            autoFocus
          />
        )}
        readView={() => (
          <BoxAtlas
            xcss={readViewContainerStyles}
            style={{ fontWeight: '600', fontSize: '24px' }}
            testId="read-view"
          >
            {editValue}
          </BoxAtlas>
        )}
        validate={validate}
        onConfirm={(value) => {
          if (value !== editValue) {
            setEditValue(value);
            handleSubmit(value);
          }
        }}
      />
    </Box>
  );
};

export default InlineEditableField;
