module.exports = {
    setupFilesAfterEnv: [],
    testMatch: [
      '**/?(*.)spec.ts?(x)'
    ],
    globals: {
      'ts-jest': {
        tsConfig: 'tsconfig.json',
        diagnostics: false,
      },
    },
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
  }