import { theme } from '@chakra-ui/react';

import colors from '../foundations/colors';

import type { ComponentStyleConfig } from '@chakra-ui/react';

const Button: ComponentStyleConfig = {
  baseStyle: {
    fontSize: 'md',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
  },

  sizes: {
    lg: {
      fontSize: 'md',
      p: '4',
      h: '46px',
      rounded: '10px',
    },
    md: {
      fontSize: 'sm',
      h: '40px',
      p: '16px',
      rounded: '8px',
    },
  },
  variants: {
    solid: () => ({
      bg: colors.primary,
      fontSize: 'md',
      color: 'white',

      _hover: {
        opacity: 0.8,
        color: 'white',
        bg: colors.primary,
        _disabled: {
          bg: colors.neutral[300],
        },
      },
      _loading: {
        opacity: 0.5,
        _hover: {
          bg: colors.primary,
          color: 'white',
        },
      },
    }),

    ghost: (props) => ({
      ...theme.components.Button?.variants?.ghost(props),
      bg: 'gray.100',
      _hover: {
        color: 'primary',
      },
      _loading: {
        color: 'primary',
      },
    }),

    outline: (props) => ({
      ...theme.components.Button?.variants?.outline(props),
      bg: 'gray.100',
      _hover: {
        color: 'primary',
      },
      _loading: {
        color: 'primary',
      },
    }),
  },
};
export default Button;
