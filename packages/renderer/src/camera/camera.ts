import { Bounds, Node2d, NodeTypes, TiledOrientation, Vector2 } from "@js-mmo/engine";

import * as RendererConfig from "../renderer_config";

export class Camera extends Node2d {
  type = NodeTypes.Camera;
  zoom = 1;
  orientation = TiledOrientation.Orthogonal;

  public screenOrigin(): Vector2 {
    return this.position.multiplyScalar(RendererConfig.PIXELS_PER_UNIT);
  }

  public getViewPosition(pos: Vector2): Vector2 {
    // const bounds = this.getViewportBounds();
    // const offset = bounds.northWest.subtract(pos);
    const offset = this.position.subtract(pos);
    return offset.multiplyScalar(RendererConfig.PIXELS_PER_UNIT);
  }

  public worldFromScreen(pos: Vector2): Vector2 {
    return new Vector2(pos.x / RendererConfig.PIXELS_PER_UNIT, pos.y / RendererConfig.PIXELS_PER_UNIT);
  }

  public getViewportBounds(): Bounds {
    const unitsPerWidth = window.innerWidth / (RendererConfig.PIXELS_PER_UNIT * this.zoom);
    const unitsPerHeight = window.innerHeight / (RendererConfig.PIXELS_PER_UNIT * this.zoom);
    return new Bounds(this.position, new Vector2(unitsPerWidth, unitsPerHeight));
  }
}
