import { Vector2 } from "@js-mmo/engine";

import { Camera } from "../../camera/camera";

export enum DTextAlign {
  Left = "left",
  Right = "right",
  Center = "center",
  Start = "start",
  End = "end",
}

export enum DTextBaseline {
  Top = "top",
  Middle = "middle",
  Bottom = "bottom",
  Hanging = "hanging",
  Alphabetic = "alphabetic",
  Ideographic = "ideographic",
}

export enum DFontStyle {
  Normal = "normal",
  Italic = "italic",
  Oblique = "oblique",
}

type FontWeights =
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
// type FontWeights = FontWeightKeywords | FontWeightValues;

export interface DText {
  id: string;
  text: string;
  color: string;
  align: DTextAlign;
  baseline: DTextBaseline;
  fontSize: number;
  fontWeight: FontWeights;
  fontStyle: DFontStyle;
  fontFamily: string;
  position: Vector2;
  scale: Vector2;
  rotation: number;
  maxWidth?: number;
}
