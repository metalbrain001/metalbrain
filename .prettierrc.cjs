module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  jsxSingleQuote: false,
  arrowParens: 'avoid',
  endOfLine: 'auto',
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'auto',
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  rangeEnd: Infinity,
  filepath: '',
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
        parser: 'json',
      },
    },
  ],
};
