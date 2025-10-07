// Test setup for engine modules
import 'jest';

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Mock timers for testing
jest.useFakeTimers();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Restore timers after all tests
afterAll(() => {
  jest.useRealTimers();
});
