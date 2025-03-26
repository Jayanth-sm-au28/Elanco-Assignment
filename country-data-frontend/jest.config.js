module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!**/node_modules/**',
    ],
    moduleNameMapper: {
      // Handle module aliases (if you use them in your project)
      '^@/(.*)$': '<rootDir>/src/$1',
      // Handle CSS imports (if you use CSS in your project)
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
    transform: {
      // Use babel-jest to transpile tests with the next/babel preset
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
      '/node_modules/',
      '^.+\\.module\\.(css|sass|scss)$',
    ],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    }
  };