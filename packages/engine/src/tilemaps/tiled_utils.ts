import { Vector2 } from "../math/vector2";

import { TiledLayerType, TiledMap, TiledMapLayer, TiledRenderOrder } from "./tiled_types";

export const getTileX = (index: number, layerWidth = 100, renderOrder = TiledRenderOrder.LeftDown): number => {
  switch (renderOrder) {
    case TiledRenderOrder.RightDown:
    case TiledRenderOrder.RightUp:
      return layerWidth - (index % layerWidth);
    case TiledRenderOrder.LeftDown:
    case TiledRenderOrder.LeftUp:
    default:
      return index % layerWidth;
  }
};

export const getTileY = (
  index: number,
  layerWidth = 100,
  layerHeight = 100,
  renderOrder = TiledRenderOrder.LeftDown
): number => {
  switch (renderOrder) {
    case TiledRenderOrder.LeftUp:
    case TiledRenderOrder.RightUp:
      return layerHeight - Math.floor(index / layerWidth);
    case TiledRenderOrder.LeftDown:
    case TiledRenderOrder.RightDown:
    default:
      return Math.floor(index / layerWidth);
  }
};

export type LayerCallback = (layer: TiledMapLayer, index: number, map: TiledMap) => void;
export const forLayerInMap = (map: TiledMap, cb: LayerCallback): void => {
  for (let i = 0; i < map.layers.length; i++) {
    cb(map.layers[i], i, map);
  }
};

export type TileCallback = (pos: Vector2, tile: number, layer: TiledMapLayer, map: TiledMap) => void;
export const forTileInLayer = (layer: TiledMapLayer, map: TiledMap, cb: TileCallback): void => {
  if (!layer?.data || layer?.type === TiledLayerType.Object) {
    return;
  }

  let x = 0;
  let y = 0;

  for (let i = 0; i < layer.data.length; i++) {
    // 0 means "empty" in exported Tiled maps.
    if (layer.data[i] === 0) {
      continue;
    }

    x = getTileX(i, layer.width, map.renderorder as TiledRenderOrder);
    y = getTileY(i, layer.width, layer.height, map.renderorder as TiledRenderOrder);
    cb(new Vector2(x, y), layer.data[i], layer, map);
  }
};
