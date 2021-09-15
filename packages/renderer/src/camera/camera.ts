import { Bounds, Node2d, NodeTypes, TiledOrientation, Vector2 } from "@js-mmo/engine";

import * as RendererConfig from "../renderer_config";

export class Camera extends Node2d {
  type = NodeTypes.Camera;
  zoom = 1;
  orientation = TiledOrientation.Orthogonal;

  public screenOrigin(): Vector2 {
    return this.position;
  }

  public getViewPosition(pos: Vector2): Vector2 {
    const offset = this.position.add(pos);
    return Vector2.MultiplyScalar(offset, RendererConfig.PIXELS_PER_UNIT * RendererConfig.PIXEL_RATIO);
  }

  public worldFromScreen(pos: Vector2): Vector2 {
    return new Vector2(
      pos.x / RendererConfig.PIXELS_PER_UNIT / RendererConfig.PIXEL_RATIO,
      pos.y / RendererConfig.PIXELS_PER_UNIT / RendererConfig.PIXEL_RATIO
    );
  }

  public getViewportBounds(): Bounds {
    const unitsPerWidth = window.innerWidth / RendererConfig.PIXELS_PER_UNIT;
    const unitsPerHeight = window.innerHeight / RendererConfig.PIXELS_PER_UNIT;
    return new Bounds(
      this.screenOrigin().divideScalar(RendererConfig.PIXELS_PER_UNIT),
      new Vector2(unitsPerWidth, unitsPerHeight)
    );
  }
}
