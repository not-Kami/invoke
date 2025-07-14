export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.(spec|test).js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/seeders/**',
    '!**/node_modules/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTest.js'],
  testTimeout: 10000,
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  maxWorkers: 1,
}; 