import { useEffect, useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box as BoxAtlas, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { Box, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RiEditFill } from 'react-icons/ri';

import { useUpsertIssueHook } from '../hooks/mutations';

import type { IIssue } from '../types';

import { CustomLink } from '@/components/elements';
import { formatDate } from '@/libs/helpers';

const readViewContainerStyles = xcss({
  font: 'font.body',
  margin: '0',
  wordBreak: 'break-word',
});

const InlineEditWithIcon = ({
  issue,
  buttonStyle,
  textStyle,
  boxStyle,
  fieldStyle,
  statusId,
  link,
  isViewOnly = false,
}: {
  issue: IIssue;
  buttonStyle?: any;
  textStyle?: any;
  boxStyle?: any;
  fieldStyle?: any;
  statusId?: string;
  link?: string;
  isViewOnly?: boolean;
}) => {
  const { t } = useTranslation();
  const [editValue, setEditValue] = useState(issue.title);
  const [isEditing, setIsEditing] = useState(false);

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
      actualEndDate: issue.actualEndDate
        ? (formatDate({
            date: issue.actualEndDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date)
        : undefined,
      statusId: statusId || issue.status.id,
      labelId: issue.label?.id,
      assigneeId: issue.assignee?.id,
      phaseId: issue.phase?.id,
      priority: issue.priority,
      title: value || issue.title,
      parentIssueId: issue.parentIssue?.id,
    });
  };

  return (
    <Box
      _hover={{
        '.edit-icon': {
          color: 'gray.400',
        },
      }}
      display="flex"
      flex={1}
      flexDir="column"
    >
      {!isViewOnly ? (
        <InlineEdit
          defaultValue={editValue}
          editButtonLabel={editValue}
          isEditing={isEditing}
          // keepEditViewOpenOnBlur
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          editView={({ errorMessage, ...fieldProps }) => (
            <Textfield style={{ minWidth: '200px', ...fieldStyle }} {...fieldProps} autoFocus />
          )}
          readView={() => (
            <BoxAtlas xcss={readViewContainerStyles} testId="read-view">
              <Box display="flex" alignItems="center" {...boxStyle}>
                <CustomLink
                  to={link || `issues/${String(issue.id)}`}
                  noOfLines={textStyle ? 5 : link ? 1 : 2}
                  {...textStyle}
                >
                  {editValue}
                </CustomLink>
                <IconButton
                  aria-label="edit"
                  bg="transparent"
                  className="edit-icon"
                  fontSize="sm"
                  ml={1}
                  display={isEditing ? 'none' : 'inline-block'}
                  color="transparent"
                  _hover={{
                    color: 'gray.500',
                    background: 'transparent',
                  }}
                  _focus={{
                    background: 'transparent',
                  }}
                  icon={<RiEditFill />}
                  onClick={() => setIsEditing(true)}
                  {...buttonStyle}
                />
              </Box>
            </BoxAtlas>
          )}
          validate={validate}
          onCancel={() => setIsEditing(false)}
          onConfirm={(value) => {
            if (value !== editValue) {
              setEditValue(value);
              handleSubmit(value);
            }
            setIsEditing(false);
          }}
        />
      ) : (
        <Box display="flex" alignItems="center" {...boxStyle}>
          <CustomLink
            to={link || `issues/${String(issue.id)}`}
            noOfLines={textStyle ? 5 : link ? 1 : 2}
            fontSize="14px"
            {...textStyle}
          >
            {editValue}
          </CustomLink>
        </Box>
      )}
      {/* <IconButton
        aria-label="edit"
        bg="transparent"
        className="edit-icon"
        fontSize="sm"
        ml={1}
        display={isEditing ? 'none' : 'inline-block'}
        color="transparent"
        _hover={{
          color: 'gray.500',
          background: 'transparent',
        }}
        _focus={{
          background: 'transparent',
        }}
        icon={<RiEditFill />}
        onClick={() => setIsEditing(true)}
        {...buttonStyle}
      /> */}
    </Box>
  );
};

export default InlineEditWithIcon;
