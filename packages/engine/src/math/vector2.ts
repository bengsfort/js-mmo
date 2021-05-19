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

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  add(other: V2): void {
    this.x += other.x;
    this.y += other.y;
  }

  multiply(val: number): void {
    this.x *= val;
    this.y *= val;
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  clamp(xMin: number, xMax: number, yMin: number, yMax: number): void {
    this.clampX(xMin, xMax);
    this.clampY(yMin, yMax);
  }

  clampX(min: number, max: number): void {
    this.x = clamp(this.x, min, max);
  }

  clampY(min: number, max: number): void {
    this.y = clamp(this.y, min, max);
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
