import { LOG_VERBOSE } from "../engine_config";

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

/**
 * Makes a collection of logging functions with the given prefix.
 * Returns an already created collection if the prefix is already in the cache.
 *
 * @param {string} prefix The prefix to add prepend to each log.
 * @returns {Logger} A collection of logging functions with the given prefix.
 */
export const makeLogger = (prefix: string): Logger => {
  if (activeLoggers.has(prefix)) return activeLoggers.get(prefix) as Logger;

  const log: LogFunction = (...args) => console.log(`[${prefix}]`, ...args);
  const logInfo: LogFunction = (...args) => console.info(`[${prefix}]`, ...args);
  const logWarn: LogFunction = (...args) => console.warn(`[${prefix}]`, ...args);
  const logError: LogFunction = (...args) => console.error(`[${prefix}]`, ...args);
  const verboseLog: LogFunction = (...args) => {
    LOG_VERBOSE && log("[VERBOSE]", ...args);
  };
  const verboseLogInfo: LogFunction = (...args) => {
    LOG_VERBOSE && logInfo("[VERBOSE]", ...args);
  };
  const verboseLogWarn: LogFunction = (...args) => {
    LOG_VERBOSE && logWarn("[VERBOSE]", ...args);
  };
  const verboseLogError: LogFunction = (...args) => {
    LOG_VERBOSE && logError("[VERBOSE]", ...args);
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
