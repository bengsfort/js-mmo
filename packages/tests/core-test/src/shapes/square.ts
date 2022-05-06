import { Bounds, Node2D, Vector2 } from '@js-mmo/core';

type HorizontalAlignment = "left" | "center" | "right";
type VerticalAlignment = "top" | "center" | "bottom";

export class Square extends Node2D {
  public color: string | CanvasGradient | CanvasPattern;
  public hAlign: HorizontalAlignment;
  public vAlign: VerticalAlignment;

  public debug = true;

  // Bounds for managing the size of the square
  private _bounds: Bounds;
  public get bounds(): Bounds {
    this._bounds.position = this._getBoundsOffset();
    return this._bounds;
  }

  constructor(width: number, height: number, hAlign: HorizontalAlignment = "left", vAlign: VerticalAlignment = "top") {
    super();
    this.hAlign = hAlign;
    this.vAlign = vAlign;
    this._bounds = new Bounds(this.transform.position, new Vector2(width, height));
    this._bounds.position = this._getBoundsOffset();
    this.color = "#f0f";
  }

  private _getBoundsOffset(): Vector2 {
    const bounds = this._bounds;
    const worldPos = this.getWorldPosition();

    let xOffset = 0;
    if (this.hAlign === "left") xOffset = bounds.halfSize.x;
    else if (this.hAlign === "right") xOffset = bounds.size.x;

    let yOffset = 0;
    if (this.vAlign === "top") yOffset = bounds.halfSize.y;
    else if (this.vAlign === "bottom") xOffset = bounds.size.y;

    return new Vector2(
      worldPos.x + xOffset,
      worldPos.y + yOffset,
    );
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

    const bounds = this.bounds;
    ctx.fillRect(bounds.left, bounds.top, bounds.size.x, bounds.size.y);

    ctx.restore();
    if (this.debug) this.renderDebug(ctx);
  }
}
