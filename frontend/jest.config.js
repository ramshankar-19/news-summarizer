module.exports = {
  transformIgnorePatterns: [
    // This is required to transform node_modules/axios which uses ESM
    "/node_modules/(?!axios)"
  ],
  moduleNameMapper: {
    // Handle CSS imports
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    // Handle image imports
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  testEnvironment: "jsdom"
}; 