import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  verbose: true,
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/src/**/*.test.ts"],
  maxWorkers: 1,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        useESM: true,
      }
    ],
  },
};

export default jestConfig;