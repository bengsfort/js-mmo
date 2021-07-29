import { Vector2 } from "@js-mmo/engine";

import { Drawable, DrawableType } from "../drawable";
import { GET_ID } from "../../constants";

import { DSprite } from "./sprite_internal";

// External
export type SpriteDrawable = Drawable<DSprite>;
export type SpriteOpts = Omit<DSprite, "id"> & {
  origin?: Vector2;
  scale?: Vector2;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
};

const DEFAULT_OPTS = {
  scale: Vector2.One,
  origin: Vector2.Zero,
  flipX: false,
  flipY: false,
  rotation: 0,
};

export const createSprite = (opts: SpriteOpts): Drawable<DSprite> => {
  const id = `drawable::sprite::${GET_ID()}`;
  const data = {
    ...DEFAULT_OPTS,
    ...opts,
    id,
  };
  return {
    type: DrawableType.Sprite,
    data,
  };
};
