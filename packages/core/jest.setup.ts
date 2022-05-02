import { clearLoggingLevel, LoggingLevel } from './src/logging';

// Disable verbose logs during tests
clearLoggingLevel(LoggingLevel.Verbose);
