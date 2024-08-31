/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'], // Recognize these file extensions
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup file for jest-dom or other utilities
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
    '^@/(.*)$': '<rootDir>/src/client/$1', // Resolve @ alias for imports
  },
};
