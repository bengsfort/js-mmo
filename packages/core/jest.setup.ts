import { Log } from './src/logs';

// Disable verbose logs during tests
Log.clearLoggingLevel(Log.LoggingLevel.Verbose);
