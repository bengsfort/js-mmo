import { TiledMap, TiledOrientation, Vector2 } from "@js-mmo/engine";
import { coordsToIsometricScreen, coordsToScreen } from "../../web/canvas";

import { RuntimeTileset } from "../../asset_management/tileset_manager";
import { forTileInLayer } from "@js-mmo/engine/build/tilemaps/tiled_utils";
import { logger } from "../../logger";

export interface DTilemap {
  id: string;
  tilemap: TiledMap;
  layer: number;
  tileset: RuntimeTileset;
  position: Vector2;
  scale: Vector2;
}

// @todo: Use width + height from tiles to apply proper position offset
export const drawTilemap = (drawable: DTilemap, context: CanvasRenderingContext2D) => {
  const { tilemap, layer, tileset, position, scale } = drawable;

  context.save();

  const tiles = tilemap.layers[layer]?.data;
  if (!tiles) {
    logger.logError(
      "Trying to render a tilemap layer that doesn't exists! Check tilemap for",
      tilemap.editorsettings.export.target
    );
    context.restore();
    return;
  }

  const scaledWidth = tileset.tileWidth * scale.x;
  const scaledHeight = tileset.tileHeight * scale.y;

  // @todo: Need to re-think isometric rendering, it should hopefully be global
  forTileInLayer(tilemap.layers[layer], tilemap, (pos: Vector2, tile: number) => {
    const tileSrcIdx = Math.max(tile - 1, 0);
    let screenPos: Vector2;
    if (tilemap.orientation === TiledOrientation.Isometric) {
      screenPos = coordsToIsometricScreen(
        context.canvas,
        (position.x + pos.x) * scale.x,
        (position.y + pos.y) * scale.y
      );
    } else {
      screenPos = coordsToScreen((position.x + pos.x) * scale.x, (position.y + pos.y) * scale.y);
    }
    context.drawImage(tileset.tiles[tileSrcIdx], screenPos.x, screenPos.y, scaledWidth, scaledHeight);
  });

  // if (DEBUG_SHOW_ORIGINS) {
  //   drawOrigin(context, pos, Vector2.Zero, scale, width, height);
  // }

  context.restore();
};
