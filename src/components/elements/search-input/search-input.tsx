import React, { useEffect } from 'react';

import { Box, Icon } from '@chakra-ui/react';
import { MdClose, MdSearch } from 'react-icons/md';

import type { CustomInputProps } from '@/components/elements';
import type { IconProps } from '@chakra-ui/react';

import { CustomInput } from '@/components/elements';
import { useDebounce } from '@/libs/hooks';
import { useIsMounted } from '@/libs/hooks/use-is-mounted';

interface SearchInputProps extends CustomInputProps {
  initValue?: string;
  onHandleSearch: (value: string | undefined) => void;

  iconSearchProps?: IconProps;
}

export function SearchInput({
  onHandleSearch,
  initValue = undefined,
  iconSearchProps,
  ...rest
}: SearchInputProps) {
  const [debounceSearchValue, setSearchValue, value] = useDebounce(initValue);
  const isMounted = useIsMounted();

  const searchRef = React.useRef<HTMLInputElement>() as React.RefObject<HTMLInputElement>;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  function handleClearSearchValue() {
    setSearchValue(undefined);
    onHandleSearch(undefined);
  }

  // Fetch API
  useEffect(() => {
    if (!isMounted()) return;
    onHandleSearch(
      debounceSearchValue && debounceSearchValue.trim()
        ? debounceSearchValue.trim().toLowerCase()
        : undefined
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, debounceSearchValue]);

  return (
    <CustomInput
      ref={searchRef}
      inputGroupProps={{
        size: 'md',
      }}
      autoFocus
      placeholder="Search..."
      _disabled={{
        bg: 'white',
        cursor: 'not-allowed',
      }}
      value={value || ''}
      onChange={handleChange}
      {...rest}
      rightIcon={
        <Box h="fit-content">
          {debounceSearchValue?.length ? (
            <Icon
              as={MdClose}
              boxSize={4.5}
              cursor="pointer"
              {...iconSearchProps}
              onClick={handleClearSearchValue}
            />
          ) : (
            <Icon
              as={MdSearch}
              boxSize={4.5}
              cursor="default"
              {...iconSearchProps}
              onClick={() => searchRef.current?.focus()}
            />
          )}
        </Box>
      }
    />
  );
}
