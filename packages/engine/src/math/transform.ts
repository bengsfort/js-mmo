import { Vector2 } from "./vector2";

export class Transform {
  position: Vector2;
  rotation: number;
  scale: Vector2;

  // Global
  private _worldPosition: Vector2;
  private _worldRotation: number;
  private _worldScale: Vector2;
  // Local
  private _localPosition: Vector2;
  private _localRotation: number;
  private _localScale: Vector2;

  // Ownership
  private _parent: Transform | null = null;
  private _children: Transform[] = [];

  constructor(pos = new Vector2(0, 0), scale = new Vector2(1, 1), rotation = 0) {
    this.position = pos;
    this.rotation = rotation;
    this.scale = scale;

    this._localPosition = pos.copy();
    this._localRotation = rotation;
    this._localScale = scale.copy();
  }

  getPositionRelativeToParent(parent: Transform): Vector2 {
    return Vector2.Add(this.position, parent.position);
  }

  getRotationRelativeToParent(parent: Transform): number {
    return this.rotation + parent.rotation;
  }

  getScaleRelativeToParent(parent: Transform): Vector2 {
    return Vector2.Multiply(this.scale, parent.scale);
  }
}
