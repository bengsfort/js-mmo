import {
  addLoggingLevel,
  clearLoggingLevel,
  getLoggingLevel,
  LoggingLevel,
  loggingLevelActive,
  LOG_ALL,
} from "../logging";

describe("Logging", () => {
  beforeAll(() => {
    addLoggingLevel(LOG_ALL);
  });

  afterAll(() => {
    // Make sure we dont have logging on other tests.
    clearLoggingLevel(LOG_ALL);
  });

  describe("Logging Flags", () => {
    it("Should default to all flags", () => {
      expect(LOG_ALL).toEqual(
        LoggingLevel.Log | LoggingLevel.Info | LoggingLevel.Warn | LoggingLevel.Error | LoggingLevel.Verbose
      );
      expect(getLoggingLevel()).toEqual(LOG_ALL);
    });

    it("Should allow checking if a flag(s) are enabled", () => {
      expect(
        loggingLevelActive(
          LoggingLevel.Log,
          LoggingLevel.Info,
          LoggingLevel.Warn,
          LoggingLevel.Error,
          LoggingLevel.Verbose
        )
      ).toEqual(true);
    });

    it("Should allow you to clear flags", () => {
      expect(loggingLevelActive(LoggingLevel.Verbose)).toEqual(true);
      clearLoggingLevel(LoggingLevel.Verbose);
      expect(loggingLevelActive(LoggingLevel.Verbose)).toEqual(false);

      clearLoggingLevel(LoggingLevel.Warn, LoggingLevel.Error, LoggingLevel.Log, LoggingLevel.Info);
      expect(getLoggingLevel()).toEqual(0); // None
    });

    it("Should allow you to set flags", () => {
      expect(loggingLevelActive(LoggingLevel.Log)).toEqual(false);
      addLoggingLevel(LoggingLevel.Log);
      expect(loggingLevelActive(LoggingLevel.Log)).toEqual(true);

      expect(loggingLevelActive(LoggingLevel.Info, LoggingLevel.Verbose)).toEqual(false);
      addLoggingLevel(LoggingLevel.Info, LoggingLevel.Verbose);
      expect(loggingLevelActive(LoggingLevel.Log)).toEqual(true);
    });
  });
});
