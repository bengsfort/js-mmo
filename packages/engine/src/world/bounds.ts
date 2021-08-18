import { Vector2 } from "../math/vector2";

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

  constructor(position: Vector2, size: Vector2) {
    this._pos = position;
    this._size = size;
    this._calculateExtents(position, size);
  }

  // @todo: Create a single instance for these for memory sake?
  private _calculateExtents(pos: Vector2, size: Vector2): void {
    const half = Vector2.MultiplyScalar(size, 0.5);
    const min = Vector2.Subtract(pos, half);
    const max = Vector2.Add(pos, half);

    this._ne = new Vector2(max.x, max.y);
    this._nw = new Vector2(min.x, max.y);
    this._se = new Vector2(max.x, min.y);
    this._sw = new Vector2(min.x, min.y);

    this._min = min;
    this._max = max;
    this._halfSize = half;
  }

  public includesPoint(point: Vector2): boolean {
    return point.x >= this._min.x && point.y >= this._min.x && point.x <= this._max.x && point.y <= this._max.y;
  }

  public isLeftOf(point: Vector2): boolean {
    return point.x > this._max.x;
  }
  public isRightOf(point: Vector2): boolean {
    return point.x < this._min.x;
  }
  // @todo: might need to swap these
  public isAbove(point: Vector2): boolean {
    return point.y < this._min.y;
  }
  public isBelow(point: Vector2): boolean {
    return point.y > this._max.y;
  }
}
