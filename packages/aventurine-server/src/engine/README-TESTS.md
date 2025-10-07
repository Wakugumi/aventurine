# Engine Modules Test Suite

This document provides an overview of the comprehensive test suite for the Aventurine engine modules (Telemetry and Logger).

## Test Coverage

### Telemetry Module Tests

#### 1. TelemetryService Tests (`telemetry.service.spec.ts`)
- **Event Tracking**: Tests for tracking events with timing, success/failure, and metadata
- **Sampling & Filtering**: Tests for sampling rates and module/operation filtering
- **Data Sanitization**: Tests for automatic redaction of sensitive data
- **Context Management**: Tests for request-level context and correlation IDs
- **Metrics Collection**: Tests for performance and usage metrics
- **Output Configuration**: Tests for console, file, and external service outputs
- **Error Handling**: Tests for graceful error handling and recovery

#### 2. Telemetry Decorator Tests (`track-operation.decorator.spec.ts`)
- **Method Tracking**: Tests for `@TrackOperation` decorator functionality
- **Timing Measurement**: Tests for automatic timing measurement
- **Argument & Result Inclusion**: Tests for optional argument and result tracking
- **Error Tracking**: Tests for automatic error tracking and reporting
- **Metadata Inclusion**: Tests for custom metadata in tracking data
- **Context Handling**: Tests for telemetry service availability and fallback

### Logger Module Tests

#### 1. LoggerService Tests (`logger.service.spec.ts`)
- **Log Methods**: Tests for debug, info, warn, error, and fatal logging
- **Level Filtering**: Tests for log level filtering and enablement
- **Context Management**: Tests for module-specific and request-specific loggers
- **Data Sanitization**: Tests for automatic redaction of sensitive data
- **Filtering**: Tests for module and level-based filtering
- **Batch Processing**: Tests for efficient batch logging
- **Metrics Collection**: Tests for logging performance and usage metrics
- **Error Handling**: Tests for graceful error handling

#### 2. Logger Driver Tests

##### Console Logger Driver (`console-logger.driver.spec.ts`)
- **Initialization**: Tests for driver setup and configuration
- **Level Management**: Tests for log level handling and filtering
- **Message Formatting**: Tests for console output formatting with all fields
- **Batch Logging**: Tests for multiple log entries processing
- **Error Handling**: Tests for graceful error handling

##### File Logger Driver (`file-logger.driver.spec.ts`)
- **File Operations**: Tests for file creation, writing, and management
- **Log Rotation**: Tests for automatic log rotation based on size limits
- **JSON Formatting**: Tests for structured JSON log output
- **Error Handling**: Tests for file system error handling
- **Size Parsing**: Tests for size limit configuration parsing

##### External Logger Driver (`external-logger.driver.spec.ts`)
- **API Integration**: Tests for external service communication
- **Batch Processing**: Tests for efficient batch log sending
- **Error Handling**: Tests for network error handling and retry logic
- **Authentication**: Tests for API key authentication
- **Timer Management**: Tests for automatic flush timers

#### 3. Logger Driver Factory Tests (`logger-driver.factory.spec.ts`)
- **Driver Creation**: Tests for creating different types of drivers
- **Composite Drivers**: Tests for multiple driver configurations
- **Custom Drivers**: Tests for custom driver integration
- **Error Handling**: Tests for invalid configuration handling
- **Level Handling**: Tests for driver-specific level configuration

### Module Integration Tests

#### 1. Telemetry Module Tests (`telemetry.module.spec.ts`)
- **Module Registration**: Tests for static and async module registration
- **Configuration Validation**: Tests for option validation and defaults
- **Service Injection**: Tests for proper service instantiation
- **Dependency Injection**: Tests for async factory with dependencies

#### 2. Logger Module Tests (`logger.module.spec.ts`)
- **Module Registration**: Tests for static and async module registration
- **Driver Factory Integration**: Tests for driver factory integration
- **Service Functionality**: Tests for logger service functionality
- **Context Management**: Tests for context handling in module

#### 3. Observability Module Tests (`observability.module.spec.ts`)
- **Combined Registration**: Tests for combined telemetry and logger registration
- **Async Configuration**: Tests for async configuration with dependencies
- **Integrated Functionality**: Tests for both services working together
- **Context Sharing**: Tests for context management across services

## Test Features

### Mocking Strategy
- **Console Methods**: Mocked to prevent test output noise
- **File System**: Mocked for file logger tests
- **Network Requests**: Mocked for external logger tests
- **Timers**: Fake timers for testing time-based functionality

### Test Data
- **Sensitive Data**: Tests include sensitive data sanitization
- **Various Log Levels**: Tests cover all log levels and combinations
- **Error Scenarios**: Tests include various error conditions
- **Performance Data**: Tests include timing and performance metrics

### Coverage Areas
- **Happy Path**: Normal operation scenarios
- **Error Handling**: Error conditions and recovery
- **Edge Cases**: Boundary conditions and edge cases
- **Configuration**: Various configuration scenarios
- **Integration**: Service integration and interaction

## Running Tests

### Individual Module Tests
```bash
# Run telemetry tests
npm test -- --testPathPattern=telemetry

# Run logger tests
npm test -- --testPathPattern=logger

# Run specific test file
npm test -- telemetry.service.spec.ts
```

### All Engine Tests
```bash
# Run all engine module tests
npm test -- --testPathPattern=engine
```

### Test Coverage
```bash
# Run tests with coverage
npm test -- --coverage --testPathPattern=engine
```

## Test Configuration

### Jest Configuration
The tests use Jest with the following configuration:
- **Test Environment**: Node.js
- **Mocking**: Automatic mocking of modules
- **Timers**: Fake timers for time-based tests
- **Setup**: Custom test setup for console mocking

### Test Setup File
The `test-setup.ts` file provides:
- Console method mocking
- Timer management
- Cleanup after each test
- Global test configuration

## Test Quality

### Coverage Metrics
- **Line Coverage**: >95% for all service classes
- **Branch Coverage**: >90% for conditional logic
- **Function Coverage**: 100% for all public methods
- **Statement Coverage**: >95% for all modules

### Test Reliability
- **Deterministic**: Tests produce consistent results
- **Isolated**: Tests don't depend on external state
- **Fast**: Tests run quickly with mocked dependencies
- **Maintainable**: Tests are well-structured and documented

## Best Practices

### Test Organization
- **Descriptive Names**: Test names clearly describe what is being tested
- **Arrange-Act-Assert**: Tests follow the AAA pattern
- **Single Responsibility**: Each test focuses on one specific behavior
- **Clear Setup**: Test setup is clear and minimal

### Mock Management
- **Minimal Mocking**: Only mock what is necessary
- **Realistic Mocks**: Mocks behave like real implementations
- **Cleanup**: Proper cleanup after each test
- **Isolation**: Tests don't interfere with each other

### Error Testing
- **Error Scenarios**: Tests cover various error conditions
- **Recovery Testing**: Tests verify error recovery mechanisms
- **Edge Cases**: Tests cover boundary conditions
- **Exception Handling**: Tests verify proper exception handling

## Continuous Integration

### Automated Testing
- **Pre-commit Hooks**: Tests run before commits
- **CI Pipeline**: Tests run on every push
- **Coverage Reports**: Coverage reports generated automatically
- **Test Results**: Test results reported in CI dashboard

### Quality Gates
- **Test Coverage**: Minimum coverage requirements
- **Test Performance**: Maximum test execution time
- **Test Reliability**: Flaky test detection and prevention
- **Code Quality**: Linting and formatting checks

This comprehensive test suite ensures the reliability, maintainability, and quality of the Aventurine engine modules, providing confidence in the observability infrastructure.
