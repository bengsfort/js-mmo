module.exports = {
  displayName: "Engine",
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src/"],
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/node_modules/", "<rootDir>/build/"]
};
