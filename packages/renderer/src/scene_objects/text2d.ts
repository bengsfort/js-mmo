import { Bounds, Node2d, NodeTypes, SceneObject, Vector2 } from "@js-mmo/engine";

import { FontStretch, FontStyle, FontWeights, TextAlign, TextBaseline } from "../drawables/text/text_internal";
import { RenderingNode } from "../drawables/rendering_node";
import { createText, TextDrawable } from "../drawables/text/text";

import { RenderObject } from "./render_object";

export class Text2d extends RenderObject<TextDrawable> {
  public readonly type = NodeTypes.Draw;

  public text: string;
  public fontSize: number;
  public fontFamily: string;

  public color = "#fff";
  public align = TextAlign.Left;
  public baseline = TextBaseline.Alphabetic;
  public fontWeight: FontWeights = 400;
  public fontStyle = FontStyle.Normal;
  public fontVariant: "normal" | "small-caps" = "normal";
  public lineHeight: number | string = 1.2;
  public fontStretch: FontStretch = "normal";
  public outline?: string | undefined;
  public outlineWidth?: number | undefined;

  protected _drawable: TextDrawable;
  public get drawable(): TextDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      text: this.text,
      color: this.color,
      align: this.align,
      baseline: this.baseline,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      fontFamily: this.fontFamily,
      fontVariant: this.fontVariant,
      fontStretch: this.fontStretch,
      lineHeight: this.lineHeight,
      position: this.position,
      scale: this.scale,
      rotation: this.rotation,
      outline: this.outline,
      outlineWidth: this.outlineWidth,
    };
    return this._drawable;
  }

  constructor(pos: Vector2, text: string, fontSize = 16, fontFamily = "mono") {
    super("Text");

    this.position = pos;
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;

    // @todo: The size should be dynamic, and calculated using `CanvasRenderingContext2d.measureText()`.
    this._bounds = new Bounds(this.position, Vector2.One.multiplyScalar(32));
    this._drawable = createText({
      text,
      fontSize,
      fontFamily,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontStretch: this.fontStretch,
      lineHeight: this.lineHeight,
      color: this.color,
      align: this.align,
      baseline: this.baseline,
      position: this.position,
      scale: this.scale,
      rotation: this.rotation,
    });
  }
}
