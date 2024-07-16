export default {
  rootDir: 'src',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss|sass)$': '<rootDir>/../config/tests/style-mock.ts',
    '^@modorix-ui/(.*)$': '<rootDir>/../../../packages/ui/src/$1',
    '^@modorix-commons/(.*)$': ['<rootDir>/../../../packages/modorix-commons/src/$1'],
  },
  moduleFileExtensions: ['tsx', 'ts', 'js', 'json', 'jsx', 'node'],
  modulePaths: ['<rootDir>/src'],
};
