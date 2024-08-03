import breakpoints from './breakpoints';
import spacing from './spacing';
import { generatePercentageSpacing } from '../utils';

const sizes = {
  ...spacing,
  max: 'max-content',
  min: 'min-content',
  'w-screen': '100vw',
  'h-screen': '100vh',
  full: '100%',
  '3xs': '14rem',
  '2xs': '16rem',
  xs: '20rem',
  sm: '24rem',
  md: '28rem',
  lg: '32rem',
  xl: '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  '7xl': '80rem',
  '8xl': '90rem',
  '9xl': '100rem',

  ...generatePercentageSpacing(),

  container: {
    ...breakpoints,
  },
} as const;

export default sizes;
