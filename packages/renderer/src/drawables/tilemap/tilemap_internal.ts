import { TiledRenderOrder, Vector2, TiledUtils } from "@js-mmo/engine";

import { coordsToIsometricScreen, coordsToScreen } from "../../web/canvas";
import { DEBUG_SHOW_ORIGINS } from "../../renderer_config";
import { drawOrigin } from "../helpers";

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

// @todo: Use width + height from tiles to apply proper position offset
export const drawTilemap = (drawable: DTilemap, context: CanvasRenderingContext2D) => {
  const { width, height, tileset, renderOrder, map, position, scale, origin, renderIsometric } = drawable;

  context.save();

  const orig = new Vector2(origin.x * width, origin.y * height);
  const pos = renderIsometric
    ? coordsToIsometricScreen(context.canvas, position.x * scale.x, position.y * scale.y)
    : coordsToScreen(position.x * scale.x, position.y * scale.y);

  const scaledWidth = width * scale.x;
  const scaledHeight = height * scale.y;

  for (let i = 0; i < map.length; i++) {
    const x = TiledUtils.getTileX(i, width, renderOrder) * 32;
    const y = TiledUtils.getTileY(i, width, height, renderOrder) * 16;
    context.drawImage(
      tileset[map[Math.max(i - 1, 0)]],
      pos.x + x - orig.x,
      pos.y + y - orig.y,
      scaledWidth,
      scaledHeight
    );
  }

  if (DEBUG_SHOW_ORIGINS) {
    drawOrigin(context, pos, orig, scale, width, height);
  }

  context.restore();
};
