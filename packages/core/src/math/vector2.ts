import { clamp } from "./utils";

let id = 0;

export interface V2 {
  x: number;
  y: number;
}

export class Vector2 implements V2 {
  // Helpers
  public static get Down() {
    return new Vector2(0, -1);
  }
  public static get Up() {
    return new Vector2(0, 1);
  }
  public static get Left() {
    return new Vector2(-1, 0);
  }
  public static get Right() {
    return new Vector2(1, 0);
  }
  public static get One() {
    return new Vector2(1, 1);
  }
  public static get Zero() {
    return new Vector2(0, 0);
  }

  // Static Helpers
  /**
   * Create a new Vector2 that is the sum of the given Vector2's.
   * @param {Vector2} v1 First Vector2.
   * @param {Vector2} v2 Second Vector2.
   * @returns {Vector2} A new vector of the sum of the given vectors.
   */
  public static Add(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * Create a new Vector2 that is the difference of the given Vector2's.
   * @param {Vector2} v1 First Vector2.
   * @param {Vector2} v2 Second Vector2.
   * @returns {Vector2} A new vector of the difference of the given vectors.
   */
  public static Subtract(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * Create a new Vector2 by multiplying to given vectors.
   * @param {Vector2} v1 First Vector2.
   * @param {Vector2} v2 Second Vector2.
   * @returns {Vector2} A new vector with the result of the given vectors.
   */
  public static Multiply(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x * v2.x, v1.y * v2.y);
  }

  /**
   * Create a new Vector2 by multiplying the components of a vector by a given value.
   * @param {Vector2} v1 First Vector2.
   * @param {number} val The value to multiply each component by.
   * @returns {Vector2} A new vector with the result.
   */
  public static MultiplyScalar(v1: Vector2, val: number): Vector2 {
    return v1.copy().multiplyScalar(val);
  }

  /**
   * Create a new Vector2 by dividing two vectors.
   * @param {Vector2} v1 First Vector2.
   * @param {Vector2} v2 Second Vector2.
   * @returns {Vector2} A new vector of the result of the given vectors.
   */
  public static Divide(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x / v2.x, v1.y / v2.y);
  }

  /**
   * Returns whether two vector values are equal.
   * @param {Vector2} v1 First Vector2.
   * @param {Vector2} v2 Second Vector2.
   * @returns {boolean} Whether the vectors are equal.
   */
  public static Equals(v1: V2, v2: V2): boolean {
    return v1.x === v2.x && v1.y === v2.y;
  }

  /**
   * Create a new Vector2 by interpolating between two given vectors.
   * @param {Vector2} v1 Start vector.
   * @param {Vector2} v2 Target vector.
   * @param {number} t The amount to interpolate (0 being start, 1 being end, etc.)
   * @returns {Vector2} A new Vector2 with the result.
   */
  public static Lerp(v1: V2, v2: V2, t: number): Vector2 {
    return new Vector2(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t);
  }

  /**
   * Create a new Vector2 by normalizing a vector (dividing by its length, or 1)
   * @param {Vector2} vector The vector to normalize.
   * @returns {Vector2} A new Vector2 of the normalized vector.
   */
  public static Normalize(vector: V2): Vector2 {
    return new Vector2(vector.x, vector.y).normalize();
  }

  /**
   * Returns whether or not a var is a Vector2.
   * @param other The var to check.
   * @returns If the var is a Vector2.
   */
  public static IsInstance(other: unknown): other is Vector2 {
    return other instanceof Vector2;
  }

  public x = 0;
  public y = 0;

  private _id = ++id;
  public get id(): number {
    return this._id;
  }

  /**
   * Get the magnitude of the vector (x^2 + y^2).
   */
  public get magnitude(): number {
    const { x, y } = this;
    return x * x + y * y;
  }

  /**
   * Get the length of the vector (square root of magnitude)
   */
  public get length(): number {
    return Math.sqrt(this.magnitude);
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Create a copy of this Vector2.
   * @returns {Vector2} A new instance of Vector2 with this vectors components.
   */
  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Add another vector to this vector.
   * @param {Vector2} other The other vector.
   * @returns {Vector2} Itself.
   */
  add(other: V2): Vector2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * Subtract another vector from this vector.
   * @param {Vector2} other The other vector.
   * @returns Itself.
   */
  subtract(other: V2): Vector2 {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  /**
   * Multiply this vector by another vector.
   * @param {Vector2} other The other vector.
   * @returns {Vector2} Itself.
   */
  multiply(other: V2): Vector2 {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  /**
   * Multiply this vector by a single value.
   * @param {number} val The amount to multiply by.
   * @returns {Vector2} Itself.
   */
  multiplyScalar(val: number): Vector2 {
    this.x *= val;
    this.y *= val;
    return this;
  }

  /**
   * Divide this vector by a single value.
   * @param {number} val The amount to divide by.
   * @returns {Vector2} Itself.
   */
  divideScalar(val: number): Vector2 {
    this.x /= val;
    this.y /= val;
    return this;
  }

  /**
   * Multiply this vector by another vector.
   * @param {Vector2} other The other vector.
   * @returns {Vector2} Itself.
   */
  divide(other: V2): Vector2 {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  /**
   * Set the components of this vector.
   * @param {number} x The x component.
   * @param {number} y The y component.
   * @returns {Vector2} Itself.
   */
  set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Normalizing this vector (dividing by its length, or 1)
   * @returns {Vector2} Itself.
   */
  normalize(): Vector2 {
    return this.divideScalar(this.length || 1);
  }

  /**
   * Interpolating this vector to a target vector.
   * @param {Vector2} target Target vector.
   * @param {number} t The amount to interpolate (0 being itself, 1 being target, etc.)
   * @returns {Vector2} Itself.
   */
  lerp(target: V2, t: number): Vector2 {
    this.x += (target.x - this.x) * t;
    this.y += (target.y - this.y) * t;
    return this;
  }

  /**
   * Clamp the components of this vector to a min and max value for each component.
   * @param {number} xMin The minimum value for x.
   * @param {number} xMax The maximum value for x.
   * @param {number} yMin The minimum value for y.
   * @param {number} yMax The maximum value for y.
   * @returns {Vector2} Itself.
   */
  clamp(xMin: number, xMax: number, yMin: number, yMax: number): Vector2 {
    this.clampX(xMin, xMax);
    this.clampY(yMin, yMax);
    return this;
  }

  /**
   * Clamp the x component of this vector to a min and max value.
   * @param {number} min The minimum value for x.
   * @param {number} max The maximum value for x.
   * @returns {Vector2} Itself.
   */
  clampX(min: number, max: number): Vector2 {
    this.x = clamp(this.x, min, max);
    return this;
  }

  /**
   * Clamp the y component of this vector to a min and max value.
   * @param {number} min The minimum value for y.
   * @param {number} max The maximum value for y.
   * @returns {Vector2} Itself.
   */
  clampY(min: number, max: number): Vector2 {
    this.y = clamp(this.y, min, max);
    return this;
  }

  /**
   * Check equality between this vectors components and a given vectors components.
   * @param {Vector2} val The vector to check equality.
   * @returns {boolean} If the vectors are equal.
   */
  equals(val: V2): boolean {
    return val.x === this.x && val.y === this.y;
  }

  /**
   * Return a lightweight object literal with the x and y component.
   * @returns {object} An object literal with the vector set to x, y.
   */
  toLiteral(): V2 {
    return { x: this.x, y: this.y };
  }

  toString(): string {
    return `{ "x": ${this.x}, "y": ${this.y} }`;
  }
}
