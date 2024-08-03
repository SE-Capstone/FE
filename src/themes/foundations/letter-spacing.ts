import spacing from './spacing';

const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',

  ...spacing,
} as const;

export default letterSpacing;
