import { GET_ID } from "../../constants";
import { Drawable, DrawableType } from "../drawable";

import { DText, TextAlign, TextBaseline, FontWeights, FontStyle, FontStretch } from "./text_internal";

// External
export type TextDrawable = Drawable<DText>;
export type TextOpts = Omit<DText, "id"> & {
  align?: TextAlign;
  fontWeight?: FontWeights;
  fontStyle?: FontStyle;
  fontFamily?: string;
  fontVariant?: "normal" | "small-caps";
  fontStretch?: FontStretch;
  lineHeight?: number | string;
  baseline?: TextBaseline;
  rotation?: number;
};

const DEFAULT_OPTS: Partial<DText> = {
  align: TextAlign.Left,
  baseline: TextBaseline.Alphabetic,
  fontFamily: "monospace",
  fontWeight: 400,
  fontStyle: FontStyle.Normal,
  fontVariant: "normal",
  fontStretch: "normal",
  lineHeight: 1.2,
  rotation: 0,
};

export const createText = (opts: TextOpts): TextDrawable => {
  const id = `drawable::text::${GET_ID()}`;
  const data = {
    ...DEFAULT_OPTS,
    ...opts,
    id,
  };
  return {
    type: DrawableType.Text,
    data,
  };
};
