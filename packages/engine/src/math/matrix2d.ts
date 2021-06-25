import { Vector2 } from "./vector2";

const id = 0;

// This is an implementation of a 3x3 matrix for use with the 2D rendering context.
// It makes assumptions, and is likely missing a lot, as we only care about what we absolutely need.
// @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
export class Matrix2D {
  public static get Identity(): Matrix2D {
    return new Matrix2D(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  public static fromPoints(pos: Vector2, scale: Vector2): Matrix2D;
  public static fromPoints(x: number, y: number, sx?: number, sy?: number): Matrix2D;
  public static fromPoints(x: number | Vector2, y: number | Vector2, sx = 1, sy = 1): Matrix2D {
    if (x instanceof Vector2 && y instanceof Vector2) {
      const pos = x;
      const scale = y;
      return new Matrix2D(scale.x, 0, pos.x, 0, scale.y, pos.y, 0, 0, 1);
    }
    if (typeof x !== "number" && typeof y !== "number") {
      console.warn("If the first 2 arguments of Matrix2D.fromPoints are not Vector2's, they must be numbers.");
      return Matrix2D.Identity;
    }
    return new Matrix2D(sx, 0, x as number, 0, sy, y as number, 0, 0, 1);
  }

  private _values: number[];
  get values(): number[] {
    return this._values;
  }

  /**
   * Create a matrix of values.
   *
   * @param a Generally used for x scaling.
   * @param b Generally used for x skewing.
   * @param c Generally used for x translation.
   * @param d Generally used for y skewing.
   * @param e Generally used for y scaling.
   * @param f Generally used for y position.
   * @param g Generally unused (defaults to 0).
   * @param h Generally unused (defaults to 0).
   * @param i Generally unused (defaults to 1).
   */
  constructor(a = 1, b = 0, c = 0, d = 0, e = 1, f = 0, g = 0, h = 0, i = 1) {
    this._values = [a, b, c, d, e, f, g, h, i];
  }

  // Individual indices
  /*
        This ends up looking like:
        sx = scale X
        sy = scale Y
        dx = translate X
        dy = translate Y
        hk = horizontal skew
        vk = vertical skew

        a c e
        b d f
        0 0 1

        0=sx 1=hk 2=dx
        3=vk 4=sy 5=dy
        6=0  7=0  8=1
    */

  /**
   * Generally used for X scaling
   *
   * @example
   * 0 x x
   * x x x
   * x x x
   */
  get 0(): number {
    return this.values[0];
  }
  set 0(value: number) {
    this.values[0] = value;
  }

  /**
   * Generally used for horizontal skewing
   *
   * @example
   * x 0 x
   * x x x
   * x x x
   */
  get 1(): number {
    return this.values[1];
  }
  set 1(value: number) {
    this.values[1] = value;
  }

  /**
   * Generally used for X translation.
   *
   * @example
   * x x 0
   * x x x
   * x x x
   */
  get 2(): number {
    return this.values[2];
  }
  set 2(value: number) {
    this.values[2] = value;
  }

  /**
   * Generally used for Y skewing.
   *
   * @example
   * x x x
   * 0 x x
   * x x x
   */
  get 3(): number {
    return this.values[3];
  }
  set 3(value: number) {
    this.values[3] = value;
  }

  /**
   * Generally used for Y scaling.
   *
   * @example
   * x x x
   * x 0 x
   * x x x
   */
  get 4(): number {
    return this.values[4];
  }
  set 4(value: number) {
    this.values[4] = value;
  }

  /**
   * Generally used for Y translation.
   *
   * @example
   * x x x
   * x x 0
   * x x x
   */
  get 5(): number {
    return this.values[5];
  }
  set 5(value: number) {
    this.values[5] = value;
  }

  /**
   * @example
   * x x x
   * x x x
   * 0 x x
   */
  get 6(): number {
    return this.values[6];
  }
  set 6(value: number) {
    this.values[6] = value;
  }

  /**
   * @example
   * x x x
   * x x x
   * x 0 x
   */
  get 7(): number {
    return this.values[7];
  }
  set 7(value: number) {
    this.values[7] = value;
  }

  /**
   * @example
   * x x x
   * x x x
   * x x 0
   */
  get 8(): number {
    return this.values[8];
  }
  set 8(value: number) {
    this.values[8] = value;
  }

  // Helper accessors
  // Scale
  get sx(): number {
    return this[0];
  }
  get sy(): number {
    return this[4];
  }

  // Translation
  get dx(): number {
    return this[2];
  }
  get dy(): number {
    return this[5];
  }

  /**
   * Returns an array of values suitable for use with ctx2d.setTransform, which expects:
   *
   * a c e
   * b d f
   *
   * Where:
   * a: x scaling
   * b: y skewing
   * c: x skewing
   * d: y scaling
   * e: x translation
   * f: y translation
   *
   * @returns {number[]} An array of values formatted for ctx2d.setTransform.
   */
  toTransform(): number[] {
    return [this.sx, this[3], this[1], this.sy, this.dx, this.dy];
  }

  /**
   * Add another Matrix2D to this Matrix2D.
   *
   * @param other {Matrix2D} The Matrix2D to add.
   * @returns {Matrix2D} Self.
   */
  add(other: Matrix2D): Matrix2D {
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = this.values;
    this._values = [
      m0 + other[0],
      m1 + other[1],
      m2 + other[2],
      m3 + other[3],
      m4 + other[4],
      m5 + other[5],
      m6 + other[6],
      m7 + other[7],
      m8 + other[8],
    ];
    return this;
  }

  /**
   * Subtract another Matrix2D from this Matrix2D.
   *
   * @param other {Matrix2D} The Matrix2D to subtract.
   * @returns {Matrix2D} Self.
   */
  subtract(other: Matrix2D): Matrix2D {
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = this.values;
    this._values = [
      m0 - other[0],
      m1 - other[1],
      m2 - other[2],
      m3 - other[3],
      m4 - other[4],
      m5 - other[5],
      m6 - other[6],
      m7 - other[7],
      m8 - other[8],
    ];
    return this;
  }

  /**
   * Multiply this Matrix2D by a constant.
   *
   * @param value {number} The constant to multiply by.
   * @returns {Matrix2D} Self.
   */
  multiplyConstant(value: number): Matrix2D {
    this._values = this.values.map(m => m * value);
    return this;
  }

  /**
   * Multiply this Matrix2D by another Matrix2D.
   *
   * @param other {Matrix2D} The Matrix2D to multiply by.
   * @returns {Matrix2D} Self.
   */
  multiply(other: Matrix2D): Matrix2D {
    const { values: m1 } = this;
    const { values: m2 } = other;

    const result: number[] = [];
    for (let row = 0; row < 7; row += 3) {
      for (let col = 0; col < 3; col++) {
        result[row + col] = m1[row] * m2[col] + m1[row + 1] * m2[col + 3] + m1[row + 2] * m2[col + 6];
      }
    }

    this._values = result;
    return this;
  }

  /**
   * Returns the inverse of this Matrix2D.
   * @returns {Matrix2D} The inverse of this Matrix2D.
   */
  inverse(): Matrix2D {
    // @see: https://www.mathsisfun.com/algebra/matrix-inverse-minors-cofactors-adjugate.html
    // @see: https://www.mathsisfun.com/algebra/matrix-determinant.html
    const minors = [
      this[4] * this[8] - this[5] * this[7],
      this[3] * this[8] - this[5] * this[6],
      this[3] * this[7] - this[4] * this[6],
      this[1] * this[8] - this[2] * this[7],
      this[0] * this[8] - this[6] * this[8],
      this[0] * this[7] - this[2] * this[6],
      this[1] * this[5] - this[2] * this[4],
      this[0] * this[5] - this[2] * this[3],
      this[0] * this[4] - this[1] * this[3],
    ];
    // Now do step 2 (cofactors);
    // then step 3 (adjugate)
    // then mult by 1/determinate
  }
}
