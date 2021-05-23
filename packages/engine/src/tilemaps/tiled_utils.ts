import { Vector2 } from "../math/vector2";

import { TiledLayerType, TiledMap, TiledMapLayer, TiledRenderOrder } from "./tiled_types";

export const getTileX = (index: number, layer: TiledMapLayer, renderOrder: TiledRenderOrder): number => {
  const width = layer.width || 100;
  switch (renderOrder) {
    case TiledRenderOrder.RightDown:
    case TiledRenderOrder.RightUp:
      return width - (index % width);
    case TiledRenderOrder.LeftDown:
    case TiledRenderOrder.LeftUp:
    default:
      return index % width;
  }
};

export const getTileY = (index: number, layer: TiledMapLayer, renderOrder: TiledRenderOrder): number => {
  const width = layer.width || 100;
  const height = layer.height || 100;
  switch (renderOrder) {
    case TiledRenderOrder.LeftUp:
    case TiledRenderOrder.RightUp:
      return height - Math.floor(index / width);
    case TiledRenderOrder.LeftDown:
    case TiledRenderOrder.RightDown:
    default:
      return Math.floor(index / width);
  }
};

export type LayerCallback = (layer: TiledMapLayer, index: number, map: TiledMap) => void;
export const forLayerInMap = (map: TiledMap, cb: LayerCallback): void => {
  for (let i = 0; i < map.layers.length; i++) {
    cb(map.layers[i], i, map);
  }
};

export type TileCallback = (pos: Vector2, layer: TiledMapLayer, map: TiledMap) => void;
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

    x = getTileX(i, layer, map.renderorder as TiledRenderOrder);
    y = getTileY(i, layer, map.renderorder as TiledRenderOrder);
    cb(new Vector2(x, y), layer, map);
  }
};
