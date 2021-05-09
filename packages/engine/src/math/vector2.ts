let id = 0;

export interface V2 {
  x: number;
  y: number;
}

export class Vector2 implements V2 {
  // Helpers
  public static readonly Down = new Vector2(0, -1);
  public static readonly Up = new Vector2(0, 1);
  public static readonly Left = new Vector2(-1, 0);
  public static readonly Right = new Vector2(1, 0);
  public static readonly One = new Vector2(1, 1);
  public static readonly Zero = new Vector2(0, 0);

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
