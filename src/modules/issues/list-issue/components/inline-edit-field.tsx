import { useEffect, useState } from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import InlineEdit from '@atlaskit/inline-edit';
import { Box as BoxAtlas, xcss } from '@atlaskit/primitives';
import TextArea from '@atlaskit/textarea';
import Textfield from '@atlaskit/textfield';
import { Box, Progress, Text } from '@chakra-ui/react';
import { isInteger, isNaN } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import { isDateLessThan, notify } from '@/libs/helpers';

const readViewContainerStyles = xcss({
  font: 'font.body',
  margin: '0',
  wordBreak: 'break-word',
});
const errorIconContainerStyles = xcss({
  paddingInlineEnd: 'space.075',
  lineHeight: '100%',
});

const InlineEditableField = ({
  fieldValue,
  callback,
  isTextArea,
  fieldName,
  issueId,
  type = 'normal',
  styleProps,
  startDate,
  minW,
  isViewOnly = false,
}: {
  fieldValue: string;
  callback: (value: string, fieldName?: string, issueId?: string) => void;
  isTextArea?: boolean;
  fieldName?: string;
  issueId?: string;
  type?: 'normal' | 'title' | 'date' | 'progress';
  styleProps?: any;
  startDate?: string;
  minW?: string;
  isViewOnly?: boolean;
}) => {
  const { t } = useTranslation();
  const [editValue, setEditValue] = useState(fieldValue);

  const validate = (value: string) => {
    if (value?.length === 0) {
      return t('validation.fieldRequired');
    }

    if (type === 'progress') {
      if (!isInteger(Number(value))) {
        return t('validation.issue.percentageInteger');
      }
      if (Number(value) < 0) {
        return t('validation.issue.percentageMin');
      }
      if (Number(value) > 100) {
        return t('validation.issue.percentageMax');
      }
    }

    if (fieldName === 'estimatedTime') {
      if (isNaN(Number(value))) {
        return t('validation.issue.estimatedNumber');
      }
      if (Number(value) < 0) {
        return t('validation.issue.estimatedTimeMin');
      }
      if (Number(value) > 1000) {
        return t('validation.issue.estimatedTimeMax');
      }
    }

    if (fieldName === 'totalEffort') {
      if (isNaN(Number(value))) {
        return t('validation.project.totalEffortNumber');
      }
      if (Number(value) < 0) {
        return t('validation.project.totalEffortMin');
      }
      if (Number(value) > 1000) {
        return t('validation.project.totalEffortMax');
      }
    }

    if (fieldName === 'actualTime') {
      if (isNaN(Number(value))) {
        return t('validation.issue.actualNumber');
      }
      if (Number(value) < 0) {
        return t('validation.issue.actualTimeMin');
      }
      if (Number(value) > 1000) {
        return t('validation.issue.actualTimeMax');
      }
    }

    return undefined;
  };

  useEffect(() => {
    setEditValue(fieldValue);
  }, [fieldValue]);

  const handleSubmit = (value: string) => {
    callback(value, fieldName, issueId);
  };

  return (
    <Box>
      {!isViewOnly ? (
        <InlineEdit
          defaultValue={editValue}
          editButtonLabel={editValue}
          // keepEditViewOpenOnBlur
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          editView={({ errorMessage, ...fieldProps }, ref) =>
            !isTextArea ? (
              type === 'title' ? (
                <InlineDialog
                  isOpen={fieldProps.isInvalid}
                  content={
                    <Box id="error-message" color="indicator.400" style={{ fontSize: '14px' }}>
                      {errorMessage}
                    </Box>
                  }
                  placement="bottom-start"
                >
                  <Textfield
                    style={{
                      fontWeight: '600',
                      fontSize: '24px',
                    }}
                    {...fieldProps}
                    elemAfterInput={
                      fieldProps.isInvalid && (
                        <BoxAtlas xcss={errorIconContainerStyles}>
                          <ErrorIcon label="error" primaryColor="#F12453" />
                        </BoxAtlas>
                      )
                    }
                    autoFocus
                  />
                </InlineDialog>
              ) : type === 'normal' || type === 'progress' ? (
                <InlineDialog
                  isOpen={fieldProps.isInvalid}
                  content={
                    <Box id="error-message" color="indicator.400">
                      {errorMessage}
                    </Box>
                  }
                  placement="bottom-start"
                >
                  <Textfield
                    {...fieldProps}
                    autoFocus
                    elemAfterInput={
                      fieldProps.isInvalid && (
                        <BoxAtlas xcss={errorIconContainerStyles}>
                          <ErrorIcon label="error" primaryColor="#F12453" />
                        </BoxAtlas>
                      )
                    }
                  />
                </InlineDialog>
              ) : (
                <DatePicker {...fieldProps} locale="vi-VN" />
              )
            ) : (
              // @ts-ignore - textarea does not pass through ref as a prop
              <TextArea {...fieldProps} ref={ref} />
            )
          }
          readView={() =>
            type === 'title' ? (
              <BoxAtlas
                xcss={readViewContainerStyles}
                style={{ fontWeight: '600', fontSize: '24px' }}
                testId="read-view"
              >
                {editValue}
              </BoxAtlas>
            ) : type === 'progress' ? (
              <Progress
                minW={minW || '200px'}
                rounded={1.5}
                colorScheme="green"
                value={Number(editValue) || 0}
              />
            ) : (
              <Text
                wordBreak="break-all"
                whiteSpace="normal"
                flex={1}
                fontWeight={500}
                {...styleProps}
              >
                {type === 'date' ? editValue || 'None' : editValue}
              </Text>
            )
          }
          validate={validate}
          onConfirm={(value) => {
            if (value !== editValue) {
              if (
                type === 'date' &&
                (fieldName === 'endDate' ||
                  fieldName === 'dueDate' ||
                  fieldName === 'actualDate') &&
                startDate &&
                isDateLessThan({ date1: value, date2: startDate })
              ) {
                notify({
                  type: 'error',
                  message: t('validation.project.endDateInvalid'),
                });
                return;
              }
              if (type === 'progress') {
                if (isNaN(value)) {
                  notify({
                    type: 'error',
                    message: t('validation.issue.percentageInteger'),
                  });
                  return;
                }
                if (Number(value) < 0) {
                  notify({
                    type: 'error',
                    message: t('validation.issue.percentageMin'),
                  });
                  return;
                }
                if (Number(value) > 100) {
                  notify({
                    type: 'error',
                    message: t('validation.issue.percentageMax'),
                  });
                  return;
                }
              }
              setEditValue(value);
              handleSubmit(value);
            }
          }}
        />
      ) : type === 'title' ? (
        <BoxAtlas
          xcss={readViewContainerStyles}
          style={{ fontWeight: '600', fontSize: '24px' }}
          testId="read-view"
        >
          {editValue}
        </BoxAtlas>
      ) : type === 'progress' ? (
        <Progress maxW="200px" rounded={1.5} colorScheme="green" value={Number(editValue) || 0} />
      ) : (
        <Text wordBreak="break-all" whiteSpace="normal" flex={1} fontWeight={500} {...styleProps}>
          {type === 'date' ? editValue || 'None' : editValue}
        </Text>
      )}
    </Box>
  );
};

export default InlineEditableField;
