import { Bounds, Node2D, Vector2 } from '@js-mmo/core';

type HorizontalAlignment = "left" | "center" | "right";
type VerticalAlignment = "top" | "center" | "bottom";

export class Square extends Node2D {
  public color: string | CanvasGradient | CanvasPattern;
  public debug = true;

  // Bounds for managing the size of the square
  private _bounds: Bounds;
  public get bounds(): Bounds {
    this._bounds.position = this.getWorldPosition();
    return this._bounds;
  }

  constructor(width: number, height: number) {
    super();

    this._bounds = new Bounds(this.transform.position, new Vector2(width, height));
    this.color = "#f0f";
  }

  public update(delta: number): void {}

  public renderDebug(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 1;

    const bounds = this.bounds;
    ctx.strokeRect(bounds.left, bounds.top, bounds.size.x, bounds.size.y);

    ctx.restore();
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = this.color;

    const bounds = this.bounds.copy();
    const scale = this.getWorldScale();
    const rotation = this.getWorldRotation();

    ctx.translate(bounds.position.x, bounds.position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale.x, scale.y);

    ctx.fillRect(-bounds.halfSize.x, -bounds.halfSize.y, bounds.size.x, bounds.size.y);

    ctx.restore();
    if (this.debug) this.renderDebug(ctx);
  }
}
