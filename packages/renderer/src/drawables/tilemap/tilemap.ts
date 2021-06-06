import { Vector2 } from "@js-mmo/engine";

import { Drawable, DrawableType } from "../drawable";
import { GET_ID } from "../../constants";

import { DTilemap } from "./tilemap_internal";

// External
export type TilemapDrawable = Drawable<DTilemap>;
export type TilemapOpts = Omit<DTilemap, "id"> & {
  origin?: Vector2;
  scale?: Vector2;
  renderIsometric?: boolean;
};

const DEFAULT_OPTS = {
  scale: Vector2.One,
  origin: Vector2.Zero,
  renderIsometric: false,
};

export const createTilemap = (opts: TilemapOpts): Drawable<DTilemap> => {
  const id = `drawable::tilemap::${GET_ID()}`;
  const data = {
    ...DEFAULT_OPTS,
    ...opts,
    id,
  };
  return {
    type: DrawableType.Tilemap,
    data,
  };
};
