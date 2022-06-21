/**
 * Clamps a value to a specific range.
 *
 * @param val The value to clamp.
 * @param min The minimum value it can be.
 * @param max The maximum value it can be.
 * @returns The clamped value.
 */
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

/**
 * Transforms a value from one range to another.
 *
 * @param value The value to transform.
 * @param oldMin The old minimum value.
 * @param oldMax The old maximum value.
 * @param newMin The new minimum value. (defaults to 0)
 * @param newMax The new maximum value. (defaults to 1)
 * @returns The translated value.
 */
export const transformRange = (value: number, oldMin: number, oldMax: number, newMin = 0, newMax = 1) =>
  ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;

/**
 * Interpolates between the given start and end values linearly.
 * @param start The starting value.
 * @param end The ending value.
 * @param t Current time.
 * @returns The lerped value.
 */
export const lerp = (start: number, end: number, t: number): number => start + (end - start) * t;

/**
 * Converts rotation in degrees to radians.
 *
 * @param degrees The starting value.
 * @return The converted value.
 */
export const convertDegreesToRadians = (degrees: number) => degrees * (Math.PI / 180);
