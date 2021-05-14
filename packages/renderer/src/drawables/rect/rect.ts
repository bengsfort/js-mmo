import { Vector2 } from "@js-mmo/engine";

import { Drawable, DrawableType } from "../drawable";
import { GET_ID } from "../../constants";

import { DRect } from "./rect_internal";

// External
export type RectOpts = Omit<DRect, "id"> & {
  origin?: Vector2;
  scale?: Vector2;
  color?: string;
  renderIsometric?: boolean;
};

const DEFAULT_OPTS = {
  scale: Vector2.One,
  origin: Vector2.Zero,
  color: "#ff00ff",
  __DEBUG__SHOW_ORIGIN: false,
};

export const createRect = (opts: RectOpts): Drawable<DRect> => {
  const id = `drawable::rect::${GET_ID()}`;
  const data = {
    ...DEFAULT_OPTS,
    ...opts,
    id,
  };
  return {
    type: DrawableType.Rect,
    data,
  };
};
