import { TiledOrientation, Vector2 } from "@js-mmo/engine";

import { ISOMETRIC_PIXELS_PER_UNIT, PIXEL_RATIO } from "../renderer_config";
import { getActiveCanvas } from "../web/web_renderer";

import { Camera } from "./camera";

export class IsometricCamera extends Camera {
  orientation = TiledOrientation.Isometric;

  public screenOrigin(): Vector2 {
    return new Vector2(
      ISOMETRIC_PIXELS_PER_UNIT.x / 2 + this.position.x + getActiveCanvas().width / PIXEL_RATIO / 2,
      ISOMETRIC_PIXELS_PER_UNIT.y / 2 + this.position.y
    );
  }

  public getViewPosition(pos: Vector2): Vector2 {
    const diff = Vector2.Subtract(pos, this.position);
    return new Vector2(
      (ISOMETRIC_PIXELS_PER_UNIT.x / 2) * (diff.x - diff.y),
      (ISOMETRIC_PIXELS_PER_UNIT.y / 2) * (diff.x + diff.y)
    );
  }
}
