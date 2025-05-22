module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // To handle Next.js style path aliases like @/lib/...
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'], // Optional: for global setup
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Ensure it uses the project's tsconfig
    },
  },
};
