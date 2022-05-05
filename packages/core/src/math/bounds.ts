import { Vector2 } from "./vector2";

export class Bounds {
  private _pos: Vector2;
  private _size: Vector2;

  private _halfSize!: Vector2;
  private _min!: Vector2;
  private _max!: Vector2;
  private _ne!: Vector2;
  private _nw!: Vector2;
  private _se!: Vector2;
  private _sw!: Vector2;

  // Get/set for main properties
  public set position(value: Vector2) {
    if (this._pos.equals(value)) return;

    this._pos = value;
    this._calculateExtents(value, this._size);
  }
  public get position(): Vector2 {
    return this._pos;
  }

  public set size(value: Vector2) {
    this._size = value;
    this._calculateExtents(this._pos, value);
  }
  public get size(): Vector2 {
    return this._size;
  }

  // Helper getters
  public get halfSize(): Vector2 {
    return this._halfSize;
  }
  public get min(): Vector2 {
    return this._min;
  }
  public get max(): Vector2 {
    return this._max;
  }
  public get minX(): number {
    return this._min.x;
  }
  public get maxX(): number {
    return this._max.x;
  }
  public get minY(): number {
    return this._min.y;
  }
  public get maxY(): number {
    return this._max.y;
  }
  public get northEast(): Vector2 {
    return this._ne;
  }
  public get northWest(): Vector2 {
    return this._nw;
  }
  public get southEast(): Vector2 {
    return this._se;
  }
  public get southWest(): Vector2 {
    return this._sw;
  }
  public get left(): number {
    return this._min.x;
  }
  public get right(): number {
    return this._max.x;
  }
  public get top(): number {
    return this._max.y;
  }
  public get bottom(): number {
    return this._min.y;
  }

  constructor(position: Vector2, size: Vector2) {
    this._pos = position.copy();
    this._size = size.copy();
    this._calculateExtents(position, size);
  }

  // @todo: Create a single instance for these for memory sake?
  private _calculateExtents(pos: Vector2, size: Vector2): void {
    const half = Vector2.MultiplyScalar(size, 0.5);
    const min = Vector2.Subtract(pos, half);
    const max = Vector2.Add(pos, half);

    // North = top (min),
    // South = bottom (max),
    // West = left (min),
    // East = right (max)
    this._ne = new Vector2(max.x, min.y);
    this._nw = new Vector2(min.x, min.y);
    this._se = new Vector2(max.x, max.y);
    this._sw = new Vector2(min.x, max.y);

    this._min = min;
    this._max = max;
    this._halfSize = half;
  }

  // Inclusion + intersections
  public includesPoint(point: Vector2): boolean {
    return point.x >= this.left && point.y >= this.bottom && point.x <= this.right && point.y <= this.top;
  }

  public includesBounds(other: Bounds): boolean {
    return this.includesPoint(other.min) && this.includesPoint(other.max);
  }

  public intersects(other: Bounds): boolean {
    return this.left <= other.right && this.right >= other.left && this.bottom <= other.top && this.top >= other.bottom;
  }

  // Directions
  public isLeftOf(point: Vector2): boolean {
    return point.x > this.right;
  }
  public isRightOf(point: Vector2): boolean {
    return point.x < this.left;
  }
  // @todo: might need to swap these
  public isAbove(point: Vector2): boolean {
    return point.y < this.bottom;
  }
  public isBelow(point: Vector2): boolean {
    return point.y > this.top;
  }
}
