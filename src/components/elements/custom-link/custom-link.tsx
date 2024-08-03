import { forwardRef, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import type { LinkProps as RouterLinkProps } from 'react-router-dom';

type CustomLinkProps = Omit<RouterLinkProps, 'color' | 'style'> &
  ChakraLinkProps & {
    isDisabled?: boolean;
  };

export const CustomLink = forwardRef<CustomLinkProps, 'a'>((props, ref) => {
  const { children, to, isDisabled, ...restCustomLinkProps } = props;

  return (
    <ChakraLink
      ref={ref}
      as={RouterLink}
      to={to}
      fontWeight="medium"
      _hover={{
        color: 'primary',
        textDecor: 'underline',
      }}
      transition="all 0.5s ease"
      {...restCustomLinkProps}
      onClick={(e) => {
        isDisabled && e.preventDefault();
        restCustomLinkProps?.onClick?.(e);
      }}
    >
      {children}
    </ChakraLink>
  );
});
