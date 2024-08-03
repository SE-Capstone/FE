module.exports = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => "yarn ts-check",

  // Lint then format TypeScript and JavaScript files
  "**/*.(ts|tsx|js|jsx)": () => [`yarn lint`],

  // Format MarkDown and JSON
  "**/*.(md|json)": () => `yarn format`,
};
