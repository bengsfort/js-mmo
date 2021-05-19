import { now } from "./time_now";

export interface Time {
  uptime: number;
  timeSinceLoaded: number;
  time: number;
  deltaTime: number;
  externalTime: number; // used for server time / client time
  externalTimeDiff: number;
}

const moduleLoaded = now();
let runtimeLoopStarted = -1;

let currentFrameStart = -1;
let lastFrameStart = -1;
let lastFrameEnd = -1;
let lastKnownExternalTime = -1;
let lastKnownExternalTimeDifference = -1;

/**
 * Starts the timeSinceLoaded timer.
 */
export const runtimeStart = (): void => {
  runtimeLoopStarted = now();
};

/**
 * Dictates the start of the current frame. Saves the previous frame duration,
 * so that the timestamps can be used to determine frame length.
 *
 * @remarks
 * This MUST be called at the beginning of every frame for accurate time keeping!
 */
export const frameStart = (): void => {
  lastFrameStart = currentFrameStart;
  lastFrameEnd = now();
  currentFrameStart = lastFrameEnd;
};

/**
 * Sets the last known external time, ie. server time or client time.
 * Also caches the time difference between the external time, and local time.
 * @param {number} externalNow The external clients time.
 */
export const setExternalTime = (externalNow: number): void => {
  lastKnownExternalTime = externalNow;
  lastKnownExternalTimeDifference = now() - lastKnownExternalTime;
};

/**
 * Gets the time it took to render the last frame.
 * @returns {number} Returns the length of the last frame.
 */
export const getDeltaTime = (): number => lastFrameEnd - lastFrameStart;

/**
 * Gets the FPS of the last frame.
 * @returns {number} The current FPS.
 */
export const getCurrentFps = (): number => 1000 / (lastFrameEnd - lastFrameStart);

/**
 * Returns how long the game has been running.
 * @returns {number} How long the game has been running.
 */
export const getUptime = (): number => now() - moduleLoaded;

/**
 * Returns the current time.
 * @returns {number} Current time.
 */
export const getCurrentTime = (): number => currentFrameStart;

/**
 * Gets a snapshot of the current time.
 * @returns {Time} A snapshot of the time.
 */
export const getTime = (): Time => ({
  uptime: getUptime(),
  timeSinceLoaded: runtimeLoopStarted,
  time: getCurrentTime(),
  deltaTime: getDeltaTime(),
  externalTime: lastKnownExternalTime + lastKnownExternalTimeDifference,
  externalTimeDiff: lastKnownExternalTimeDifference,
});
