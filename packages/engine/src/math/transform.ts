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
}
