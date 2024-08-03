function createSpacing(multiplier: number, length = 1000) {
  const spacing = {};
  for (let i = 0.5; i <= length; i += 0.5) {
    spacing[i] = `${i * multiplier}rem`;
  }
  return spacing;
}

const spacing = {
  'h-screen': '100vh',
  'w-screen': '100vw',
  px: '1px',
  ...createSpacing(0.25, 1000),
} as const;

export default spacing;
