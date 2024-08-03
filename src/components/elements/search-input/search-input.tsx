import React, { useEffect } from 'react';

import { CloseButton, Icon } from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';

import type { CustomInputProps } from '@/components/elements';
import type { CloseButtonProps, IconProps } from '@chakra-ui/react';

import { CustomInput } from '@/components/elements';
import { useDebounce } from '@/libs/hooks';
import { useIsMounted } from '@/libs/hooks/use-is-mounted';

interface SearchInputProps extends CustomInputProps {
  initValue?: string;
  onHandleSearch: (value: string | undefined) => void;

  iconSearchProps?: IconProps;

  clearButtonProps?: CloseButtonProps;
}

export function SearchInput({
  onHandleSearch,
  initValue = undefined,
  iconSearchProps,
  clearButtonProps,
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
      autoFocus
      placeholder="Tìm kiếm..."
      _disabled={{
        bg: 'white',
        cursor: 'not-allowed',
      }}
      value={value || ''}
      onChange={handleChange}
      {...rest}
      rightIcon={
        <>
          {debounceSearchValue?.length ? (
            <CloseButton size="sm" {...clearButtonProps} onClick={handleClearSearchValue} />
          ) : (
            <Icon
              as={MdSearch}
              boxSize={5}
              cursor="default"
              {...iconSearchProps}
              onClick={() => searchRef.current?.focus()}
            />
          )}
        </>
      }
    />
  );
}
