const config = {
  root: true,
  extends: "@js-mmo/internal",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json"],
  },
  rules: {},
};

module.exports = config;
