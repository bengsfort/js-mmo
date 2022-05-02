module.exports = {
  displayName: "Core",
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ['./jest.setup.ts'],
  roots: ["src/"],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/node_modules/", "<rootDir>/build/"],
};
