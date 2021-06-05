import { TiledRenderOrder, Vector2 } from "@js-mmo/engine";
import { coordsToIsometricScreen, coordsToScreen } from "../../web/canvas";

import { DEBUG_SHOW_ORIGINS } from "../../renderer_config";
import { drawOrigin } from "../helpers";
import { getTileX } from "@js-mmo/engine/build/tilemaps/tiled_utils";

export interface DTilemap {
  id: string;
  width: number;
  height: number;
  tileset: ImageBitmap[];
  renderOrder: TiledRenderOrder;
  map: number[];
  position: Vector2;
  origin: Vector2;
  scale: Vector2;
  renderIsometric: boolean;
}

export const drawSprite = (drawable: DTilemap, context: CanvasRenderingContext2D) => {
  const { width, height, tileset, renderOrder, map, position, scale, origin, renderIsometric } = drawable;

  context.save();

  const orig = new Vector2(origin.x * width, origin.y * height);
  const pos = renderIsometric
    ? coordsToIsometricScreen(context.canvas, position.x * scale.x, position.y * scale.y)
    : coordsToScreen(position.x * scale.x, position.y * scale.y);

  const scaledWidth = width * scale.x;
  const scaledHeight = height * scale.y;

  // @todo: Proper handling of render order (start from bottom, etc.)
  for (let i = 0; i < map.length; i++) {
    getTileX(i, )
    context.drawImage(image, pos.x - orig.x, pos.y - orig.y, scaledWidth, scaledHeight);
  }

  if (DEBUG_SHOW_ORIGINS) {
    drawOrigin(context, pos, orig, scale, width, height);
  }

  context.restore();
};
