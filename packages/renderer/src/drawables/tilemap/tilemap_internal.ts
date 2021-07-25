import { TiledMap, TiledOrientation, Vector2 } from "@js-mmo/engine";
import { forTileInLayer } from "@js-mmo/engine/build/tilemaps/tiled_utils";

import { ISOMETRIC_PIXELS_PER_UNIT, PIXELS_PER_UNIT } from "../../renderer_config";
import { RuntimeTileset } from "../../asset_management/tileset_manager";
import { logger } from "../../logger";
import { Camera } from "../../camera/camera";

export interface DTilemap {
  id: string;
  tilemap: TiledMap;
  layer: number;
  tileset: RuntimeTileset;
  position: Vector2;
  scale: Vector2;
}

// @todo: Use width + height from tiles to apply proper position offset
export const drawTilemap = (drawable: DTilemap, context: CanvasRenderingContext2D, camera?: Camera) => {
  const { tilemap, layer, tileset, position, scale } = drawable;

  const tiles = tilemap.layers[layer]?.data;
  if (!tiles) {
    logger.logError(
      "Trying to render a tilemap layer that doesn't exists! Check tilemap for",
      tilemap.editorsettings.export.target
    );
    return;
  }

  const viewPosition = camera?.getViewPosition(position) ?? position;
  context.translate(viewPosition.x, viewPosition.y);
  context.scale(scale.x, scale.y);

  forTileInLayer(tilemap.layers[layer], tilemap, (pos: Vector2, tile: number) => {
    const tileSrcIdx = Math.max(tile - 1, 0);
    const screenPos = new Vector2(pos.x * PIXELS_PER_UNIT, pos.y * PIXELS_PER_UNIT);
    if (tilemap.orientation === TiledOrientation.Isometric) {
      screenPos.x = (ISOMETRIC_PIXELS_PER_UNIT.x / 2) * (pos.x - pos.y);
      screenPos.y = (ISOMETRIC_PIXELS_PER_UNIT.y / 2) * (pos.x + pos.y);
    }
    context.drawImage(tileset.tiles[tileSrcIdx], screenPos.x, screenPos.y, tileset.tileWidth, tileset.tileHeight);
  });
};
