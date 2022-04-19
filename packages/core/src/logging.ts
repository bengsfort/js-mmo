// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogFunction = (...args: any[]) => void;

export interface Logger {
  log: LogFunction;
  logInfo: LogFunction;
  logWarn: LogFunction;
  logError: LogFunction;
  verboseLog: LogFunction;
  verboseLogInfo: LogFunction;
  verboseLogWarn: LogFunction;
  verboseLogError: LogFunction;
}

const activeLoggers: Map<string, Logger> = new Map();

export enum LoggingLevel {
  Log = 0x00001,
  Info = 0x00010,
  Warn = 0x00100,
  Error = 0x01000,
  Verbose = 0x10000,
}
export const LOG_ALL =
  LoggingLevel.Log | LoggingLevel.Info | LoggingLevel.Warn | LoggingLevel.Error | LoggingLevel.Verbose;

let logLevel: number = LOG_ALL;

export const addLoggingLevel = (...levels: LoggingLevel[]) => {
  logLevel = levels.reduce((total, level) => total | level, logLevel);
};

export const clearLoggingLevel = (...levels: LoggingLevel[]) => {
  logLevel = levels.reduce((total, level) => total & ~level, logLevel);
};

export const loggingLevelActive = (...levels: LoggingLevel[]) => levels.every(level => logLevel & level);

export const getLoggingLevel = () => logLevel;

/**
 * Makes a collection of logging functions with the given prefix.
 * Returns an already created collection if the prefix is already in the cache.
 *
 * @param {string} prefix The prefix to add prepend to each log.
 * @returns {Logger} A collection of logging functions with the given prefix.
 */
export const makeLogger = (prefix: string): Logger => {
  if (activeLoggers.has(prefix)) return activeLoggers.get(prefix) as Logger;

  const log: LogFunction = (...args) => loggingLevelActive(LoggingLevel.Log) && console.log(`[${prefix}]`, ...args);
  const logInfo: LogFunction = (...args) =>
    loggingLevelActive(LoggingLevel.Info) && console.info(`[${prefix}]`, ...args);
  const logWarn: LogFunction = (...args) =>
    loggingLevelActive(LoggingLevel.Warn) && console.warn(`[${prefix}]`, ...args);
  const logError: LogFunction = (...args) =>
    loggingLevelActive(LoggingLevel.Error) && console.error(`[${prefix}]`, ...args);
  const verboseLog: LogFunction = (...args) => {
    loggingLevelActive(LoggingLevel.Verbose, LoggingLevel.Log) && log("[VERBOSE]", ...args);
  };
  const verboseLogInfo: LogFunction = (...args) => {
    loggingLevelActive(LoggingLevel.Verbose, LoggingLevel.Info) && logInfo("[VERBOSE]", ...args);
  };
  const verboseLogWarn: LogFunction = (...args) => {
    loggingLevelActive(LoggingLevel.Verbose, LoggingLevel.Warn) && logWarn("[VERBOSE]", ...args);
  };
  const verboseLogError: LogFunction = (...args) => {
    loggingLevelActive(LoggingLevel.Verbose, LoggingLevel.Error) && logError("[VERBOSE]", ...args);
  };

  const logFuncs: Logger = {
    log,
    logInfo,
    logWarn,
    logError,
    verboseLog,
    verboseLogInfo,
    verboseLogWarn,
    verboseLogError,
  };

  activeLoggers.set(prefix, logFuncs);
  return logFuncs;
};
