import { Bounds, Node2D, RectBounds, Vector2 } from "@js-mmo/core";

export class Square extends Node2D {
  public color: string | CanvasGradient | CanvasPattern;
  public debug = false;

  // Bounds for managing the size of the square
  public readonly bounds: RectBounds;

  constructor(width: number, height: number) {
    super();

    this.bounds = new RectBounds(this.transform.position, new Vector2(width, height), this.transform);
    this.color = "#f0f";
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = this.color;

    const bounds = this.bounds;
    const scale = this.getWorldScale();
    const rotation = this.getWorldRotation();

    ctx.translate(bounds.position.x, bounds.position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale.x, scale.y);

    ctx.fillRect(-bounds.halfSize.x, -bounds.halfSize.y, bounds.size.x, bounds.size.y);

    ctx.restore();
  }
}
