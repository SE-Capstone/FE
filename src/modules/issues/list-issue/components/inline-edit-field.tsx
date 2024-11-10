import { useEffect, useState } from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import InlineEdit from '@atlaskit/inline-edit';
import { Box as BoxAtlas, xcss } from '@atlaskit/primitives';
import TextArea from '@atlaskit/textarea';
import Textfield from '@atlaskit/textfield';
import { Box, Progress, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { isDateLessThan, notify } from '@/libs/helpers';

const readViewContainerStyles = xcss({
  font: 'font.body',
  margin: '0',
  wordBreak: 'break-word',
});

const InlineEditableField = ({
  fieldValue,
  callback,
  isTextArea,
  fieldName,
  type = 'normal',
  styleProps,
  startDate,
}: {
  fieldValue: string;
  callback: (value: string, fieldName?: string) => void;
  isTextArea?: boolean;
  fieldName?: string;
  type?: 'normal' | 'title' | 'date' | 'progress';
  styleProps?: any;
  startDate?: string;
}) => {
  const { t } = useTranslation();
  const [editValue, setEditValue] = useState(fieldValue);

  const validate = (value: string) => {
    if (value?.length === 0) {
      return t('validation.fieldRequired');
    }
    return undefined;
  };

  useEffect(() => {
    setEditValue(fieldValue);
  }, [fieldValue]);

  const handleSubmit = (value: string) => {
    callback(value, fieldName);
  };

  return (
    <Box>
      <InlineEdit
        defaultValue={editValue}
        editButtonLabel={editValue}
        // keepEditViewOpenOnBlur
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        editView={({ errorMessage, ...fieldProps }, ref) =>
          !isTextArea ? (
            type === 'title' ? (
              <Textfield
                style={{
                  fontWeight: '600',
                  fontSize: '24px',
                }}
                {...fieldProps}
                autoFocus
              />
            ) : type === 'normal' || type === 'progress' ? (
              <Textfield {...fieldProps} autoFocus />
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
              minW="200px"
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
              (fieldName === 'endDate' || fieldName === 'dueDate') &&
              startDate &&
              isDateLessThan({ date1: value, date2: startDate })
            ) {
              notify({
                type: 'error',
                message: t('validation.project.endDateInvalid'),
              });
              return;
            }
            setEditValue(value);
            handleSubmit(value);
          }
        }}
      />
    </Box>
  );
};

export default InlineEditableField;
