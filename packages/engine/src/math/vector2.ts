import { clamp } from "./math";

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
  public static Add(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  public static Subtract(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  public static Multiply(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x * v2.x, v1.y * v2.y);
  }

  public static Divide(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x / v2.x, v1.y / v2.y);
  }

  public static Equals(v1: V2, v2: V2): boolean {
    return v1.x === v2.x && v1.y === v2.y;
  }

  public static Lerp(v1: V2, v2: V2, t: number): Vector2 {
    return new Vector2(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t);
  }

  public static Normalize(vector: V2): Vector2 {
    return new Vector2(vector.x, vector.y).normalize();
  }

  public x = 0;
  public y = 0;

  private _id = ++id;
  public get id(): number {
    return this._id;
  }

  public get magnitude(): number {
    const { x, y } = this;
    return x * x + y * y;
  }

  public get length(): number {
    return Math.sqrt(this.magnitude);
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  add(other: V2): Vector2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  multiply(other: V2): Vector2 {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  multiplyScalar(val: number): Vector2 {
    this.x *= val;
    this.y *= val;
    return this;
  }

  divideScalar(val: number): Vector2 {
    this.x /= val;
    this.y /= val;
    return this;
  }

  divide(other: V2): Vector2 {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  normalize(): Vector2 {
    return this.divideScalar(this.length || 1);
  }

  lerp(target: V2, t: number): Vector2 {
    this.x += (target.x - this.x) * t;
    this.y += (target.y - this.y) * t;
    return this;
  }

  clamp(xMin: number, xMax: number, yMin: number, yMax: number): Vector2 {
    this.clampX(xMin, xMax);
    this.clampY(yMin, yMax);
    return this;
  }

  clampX(min: number, max: number): Vector2 {
    this.x = clamp(this.x, min, max);
    return this;
  }

  clampY(min: number, max: number): Vector2 {
    this.y = clamp(this.y, min, max);
    return this;
  }

  equals(val: V2): boolean {
    return val.x === this.x && val.y === this.y;
  }

  toLiteral(): V2 {
    return { x: this.x, y: this.y };
  }

  toString(): string {
    return `{ "x": ${this.x}, "y": ${this.y} }`;
  }
}
