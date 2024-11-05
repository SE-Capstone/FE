import { useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box as BoxAtlas, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { Box, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RiEditFill } from 'react-icons/ri';

import { CustomLink } from '@/components/elements';

const readViewContainerStyles = xcss({
  font: 'font.body',
  margin: '0',
  wordBreak: 'break-word',
});

const InlineEditWithIcon = ({ id, initialValue }: { id: string; initialValue: string }) => {
  const { t } = useTranslation();
  const [editValue, setEditValue] = useState();
  const [isEditing, setIsEditing] = useState(false);

  const validate = (value: string) => {
    if (value?.length === 0) {
      return t('validation.fieldRequired');
    }
    return undefined;
  };

  return (
    <Box
      _hover={{
        '.edit-icon': {
          color: 'gray.400',
        },
      }}
      display="flex"
      flexDir="row"
    >
      <InlineEdit
        defaultValue={editValue}
        editButtonLabel={initialValue || editValue}
        isEditing={isEditing}
        editView={({ ...fieldProps }) => (
          <Textfield style={{ minWidth: '200px' }} {...fieldProps} autoFocus />
        )}
        readView={() => (
          <BoxAtlas xcss={readViewContainerStyles} testId="read-view">
            <CustomLink to={String(id)} noOfLines={1}>
              {editValue || initialValue}
            </CustomLink>
          </BoxAtlas>
        )}
        validate={validate}
        onCancel={() => setIsEditing(false)}
        onConfirm={(value) => {
          setEditValue(value);
          setIsEditing(false);
        }}
      />
      <IconButton
        aria-label="edit"
        bg="transparent"
        className="edit-icon"
        fontSize="sm"
        ml={1}
        display={isEditing ? 'none' : 'inline-block'}
        color="white"
        _hover={{
          color: 'gray.500',
          background: 'transparent',
        }}
        _focus={{
          background: 'transparent',
        }}
        icon={<RiEditFill />}
        onClick={() => setIsEditing(true)}
      />
    </Box>
  );
};

export default InlineEditWithIcon;
