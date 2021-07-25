import { Node2d, NodeTypes, TiledOrientation, Vector2 } from "@js-mmo/engine";

import { PIXEL_RATIO } from "../renderer_config";

export class Camera extends Node2d {
  type = NodeTypes.Camera;
  zoom = 1;
  orientation = TiledOrientation.Isometric;

  public screenOrigin(): Vector2 {
    return Vector2.MultiplyScalar(this.position, PIXEL_RATIO);
  }

  public worldToScreen(pos: Vector2): Vector2 {}
}
