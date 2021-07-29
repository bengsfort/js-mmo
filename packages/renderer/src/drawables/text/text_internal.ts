import { Vector2 } from "@js-mmo/engine";

import { drawOrigin } from "../helpers";
import { DEBUG_SHOW_ORIGINS } from "../../renderer_config";
import { Camera } from "../../camera/camera";

// Internal

export enum TextAlign {
  Left = "left",
  Right = "right",
  Center = "center",
  Start = "start",
  End = "end",
}

export enum TextBaseline {
  Top = "top",
  Middle = "middle",
  Bottom = "bottom",
  Hanging = "hanging",
  Alphabetic = "alphabetic",
  Ideographic = "ideographic",
}

export enum FontStyle {
  Normal = "normal",
  Italic = "italic",
  Oblique = "oblique",
}

export type FontWeights =
  | "lighter"
  | "normal"
  | "bold"
  | "bolder"
  | "inherit"
  | "initial"
  | "revert"
  | "unset"
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export type FontStretch =
  | "ultra-condensed"
  | "extra-condensed"
  | "condensed"
  | "semi-condensed"
  | "normal"
  | "semi-expanded"
  | "expanded"
  | "extra-expanded"
  | "ultra-expanded"
  | "50%"
  | "100%"
  | "200%"
  | "inherit"
  | "initial"
  | "revert"
  | "unset";

export interface DText {
  id: string;
  text: string;
  color: string;
  align: TextAlign;
  baseline: TextBaseline;
  fontSize: number;
  fontWeight: FontWeights;
  fontStyle: FontStyle;
  fontFamily: string;
  fontVariant: "normal" | "small-caps";
  lineHeight: number | string;
  fontStretch: FontStretch;
  position: Vector2;
  scale: Vector2;
  rotation: number;
  maxWidth?: number;
  outlineWidth?: number;
  outline?: string;
}

export const drawText = (drawable: DText, context: CanvasRenderingContext2D, camera?: Camera) => {
  const { text, position, rotation, scale, color, align, baseline, outline, outlineWidth, maxWidth } = drawable;
  const { fontSize, fontWeight, fontStyle, fontFamily, fontVariant, lineHeight, fontStretch } = drawable;

  // Position it
  const viewPosition = camera?.getViewPosition(position) ?? position;
  context.translate(viewPosition.x, viewPosition.y);
  context.rotate((rotation * Math.PI) / 180);
  context.scale(scale.x, scale.y);

  // Style
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = baseline;
  context.font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontStretch} ${fontSize}px/${lineHeight} ${fontFamily}`;

  if (outline) {
    context.strokeStyle = outline;
    context.lineWidth = outlineWidth ?? 1;
    context.strokeText(text, 0, 0, maxWidth);
  }
  context.fillText(text, 0, 0, maxWidth);

  if (DEBUG_SHOW_ORIGINS) {
    context.restore();
    context.save();
    drawOrigin(context, viewPosition, new Vector2(0, 0), scale, fontSize, fontSize);
  }
};
