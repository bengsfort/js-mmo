import { Node2D } from "@js-mmo/core";

export class Label extends Node2D {
  public color: string | CanvasGradient | CanvasPattern;
  public font: string;
  public text: string;

  constructor(text: string, font = "monospace", color = "#f0f") {
    super();

    this.text = text;
    this.color = color;
    this.font = font;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.textAlign = "center";

    const pos = this.getWorldPosition();
    const scale = this.getWorldScale();
    const rotation = this.getWorldRotation();

    ctx.translate(pos.x, pos.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale.x, scale.y);

    ctx.fillText(this.text, 0, 0);

    ctx.restore();
  }
}
