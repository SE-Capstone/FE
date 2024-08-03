// A utility function that generates a list of percentage values in the following format:
// {
//   '1%': '1%',
//   '2%': '2%',
//   ...
//   '100%': '100%',
// }
// The first argument is the maximum percentage value that should be generated.
// The second argument is the minimum percentage value that should be generated.

type SpacingPercentObject = Record<`${number}%`, `${number}%`>;

export function generatePercentageSpacing(percentage = 100): SpacingPercentObject {
  if (percentage < 0) {
    throw new Error('Percentage should not be negative');
  }

  if (percentage > 100) {
    throw new Error('Percentage should not be greater than 100');
  }

  const spacingPercentage: SpacingPercentObject = {};

  for (let i = 1; i <= percentage; i++) {
    spacingPercentage[`${i}%`] = `${i}%`;
  }

  return spacingPercentage;
}
