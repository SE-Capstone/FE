/* eslint-disable max-params */
import { useState } from 'react';

import {
  Button,
  Checkbox,
  VStack,
  HStack,
  Text,
  Heading,
  Container,
  Input,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from 'react-icons/md';

export default function TransferListExample() {
  const { t } = useTranslation();
  const [leftItems, setLeftItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 11',
    'Item 12',
    'Item 13',
  ]);
  const [rightItems, setRightItems] = useState(['Item 4', 'Item 5', 'Item 44', 'Item 55']);
  const [leftChecked, setLeftChecked] = useState([]);
  const [rightChecked, setRightChecked] = useState([]);
  const [leftSearchTerm, setLeftSearchTerm] = useState('');
  const [rightSearchTerm, setRightSearchTerm] = useState('');

  const handleToggle = (setChecked, _checked, value) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const moveItems = (_fromItems, setFromItems, _toItems, setToItems, checkedItems, setChecked) => {
    setToItems((prev) => [...prev, ...checkedItems]);
    setFromItems((prev) => prev.filter((item) => !checkedItems.includes(item)));
    setChecked([]);
  };

  const moveAllItems = (fromItems, setFromItems, _toItems, setToItems, setChecked) => {
    setToItems((prev) => [...prev, ...fromItems]);
    setFromItems([]);
    setChecked([]); // Clear the checked items
  };

  const filteredLeftItems = leftItems.filter((item) =>
    item.toLowerCase().includes(leftSearchTerm.toLowerCase())
  );
  const filteredRightItems = rightItems.filter((item) =>
    item.toLowerCase().includes(rightSearchTerm.toLowerCase())
  );

  const customList = (items, checked, setChecked, searchTerm, setSearchTerm) => (
    <VStack
      align="start"
      p={3}
      minW="350px"
      maxW="350px"
      minHeight="500px"
      maxHeight="500px"
      overflow="scroll"
      rounded={2.5}
      bg="white"
      shadow="md"
    >
      <Input
        placeholder={`${t('common.enter')} ${t('common.skill').toLowerCase()}...`}
        value={searchTerm}
        my={2}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {items.length === 0 ? (
        <Text fontSize="md" textAlign="center" w="full">
          {t('common.noData')}
        </Text>
      ) : (
        items.map((item) => (
          <Checkbox
            key={item}
            size="md"
            borderColor="gray.300"
            isChecked={checked.includes(item)}
            onChange={() => handleToggle(setChecked, checked, item)}
          >
            <Text>{item}</Text>
          </Checkbox>
        ))
      )}
    </VStack>
  );

  return (
    <Container mt={5}>
      <HStack spacing={4} align="start" alignItems="center">
        <VStack>
          <Heading size="lg">{t('common.skills')}</Heading>
          {customList(
            filteredLeftItems,
            leftChecked,
            setLeftChecked,
            leftSearchTerm,
            setLeftSearchTerm
          )}
        </VStack>

        <VStack>
          <Button
            disabled={leftItems.length === 0}
            onClick={() =>
              moveAllItems(leftItems, setLeftItems, rightItems, setRightItems, setLeftChecked)
            }
          >
            <MdOutlineKeyboardDoubleArrowRight />
          </Button>
          <Button
            disabled={leftChecked.length === 0}
            onClick={() =>
              moveItems(
                leftItems,
                setLeftItems,
                rightItems,
                setRightItems,
                leftChecked,
                setLeftChecked
              )
            }
          >
            <MdOutlineKeyboardArrowRight />
          </Button>
          <Button
            disabled={rightChecked.length === 0}
            onClick={() =>
              moveItems(
                rightItems,
                setRightItems,
                leftItems,
                setLeftItems,
                rightChecked,
                setRightChecked
              )
            }
          >
            <MdOutlineKeyboardArrowLeft />
          </Button>
          <Button
            disabled={rightItems.length === 0}
            onClick={() =>
              moveAllItems(rightItems, setRightItems, leftItems, setLeftItems, setRightChecked)
            }
          >
            <MdOutlineKeyboardDoubleArrowLeft />
          </Button>
        </VStack>

        <VStack>
          <Heading size="lg">{t('common.selectedSkill')}</Heading>
          {customList(
            filteredRightItems,
            rightChecked,
            setRightChecked,
            rightSearchTerm,
            setRightSearchTerm
          )}
        </VStack>
      </HStack>
    </Container>
  );
}
