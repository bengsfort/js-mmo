import { Vector2 } from "../math/vector2";

export class Position extends Vector2 {
  private _localPosition: Vector2;
  public get local(): Vector2 {
    return this._localPosition;
  }

  constructor(x: number, y: number) {
    super(x, y);
    this._localPosition = new Vector2(0, 0);
  }

  public set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    this._localPosition.add(this);
    return this;
  }
}
