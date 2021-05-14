import { Vector2 } from "./vector2";

export class Transform {
  position: Vector2;
  rotation: number;
  scale: Vector2;

  constructor(pos = new Vector2(0, 0), scale = new Vector2(1, 1)) {
    this.position = pos;
    this.rotation = 0;
    this.scale = scale;
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
