import { Node2d, NodeTypes, TiledOrientation, Vector2 } from "@js-mmo/engine";

import { PIXELS_PER_UNIT, PIXEL_RATIO } from "../renderer_config";

export class Camera extends Node2d {
  type = NodeTypes.Camera;
  zoom = 1;
  orientation = TiledOrientation.Orthogonal;

  public screenOrigin(): Vector2 {
    return Vector2.MultiplyScalar(this.position, PIXEL_RATIO);
  }

  public getViewPosition(pos: Vector2): Vector2 {
    return Vector2.MultiplyScalar(pos, PIXELS_PER_UNIT); // Should this be pixel_ratio instead?
  }
}
