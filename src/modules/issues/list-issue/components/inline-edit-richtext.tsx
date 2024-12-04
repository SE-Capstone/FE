/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from 'reactjs-tiptap-editor';

import RichtextView from './richtext-view';
import { useUpsertIssueHook } from '../hooks/mutations';
import { useEditorState } from '../hooks/use-editor-state';

import type { IIssue } from '../types';

import { formatDate } from '@/libs/helpers';
import { extensions } from '@/modules/public/pages/rich-text-ex.pages';

const InlineEditRichtext = ({
  issue,
  isEditable = true,
}: {
  issue: IIssue;
  isEditable?: boolean;
}) => {
  const { t } = useTranslation();
  const [editValue, setEditValue] = useState(issue.description || '');
  const { editor, editorRef } = useEditorState(!isEditable);

  const onChangeContent = (value: any) => {
    setEditValue(value);
  };

  useEffect(() => {
    setEditValue(issue.description || '');
  }, [issue.description]);

  const { handleUpsertIssue } = useUpsertIssueHook(editor, true, issue.id);

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
      actualDate: issue.actualDate
        ? (formatDate({
            date: issue.actualDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date)
        : undefined,
      statusId: issue.status.id,
      labelId: issue.label?.id,
      assigneeId: issue.assignee?.id,
      reporterId: issue.reporter?.id,
      phaseId: issue.phase?.id,
      priority: issue.priority,
      description: value || issue.description,
      parentIssueId: issue.parentIssue?.id,
    });
  };

  return (
    <Box>
      {isEditable ? (
        <InlineEdit
          defaultValue={editValue}
          label={
            <Text mt={-3} fontSize="md">
              {t('fields.description')}
            </Text>
          }
          keepEditViewOpenOnBlur
          readViewFitContainerWidth
          editButtonLabel={editValue}
          editView={({ errorMessage }) => (
            <RichTextEditor
              ref={editorRef}
              dark={false}
              label={t('fields.description')}
              output="html"
              content={editValue}
              extensions={extensions}
              onChangeContent={onChangeContent}
            />
          )}
          readView={() => <RichtextView id="richtext-view1" content={editValue} />}
          onConfirm={(value) => {
            if (JSON.stringify(value) !== JSON.stringify(issue.description)) {
              setEditValue(value);
              handleSubmit(value);
            }
          }}
        />
      ) : (
        <InlineEdit
          defaultValue={editValue}
          label={
            <Text mt={-3} fontSize="md">
              {t('fields.description')}
            </Text>
          }
          isEditing={false}
          keepEditViewOpenOnBlur
          readViewFitContainerWidth
          editButtonLabel={editValue}
          editView={({ errorMessage }) => <></>}
          readView={() => <RichtextView id="richtext-view1" content={editValue} />}
          onConfirm={() => {}}
        />
      )}
    </Box>
  );
};

export default InlineEditRichtext;
