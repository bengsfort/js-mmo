import { Bounds, Node2D, Vector2 } from '@js-mmo/core';

type HorizontalAlignment = "left" | "center" | "right";
type VerticalAlignment = "top" | "center" | "bottom";

export class Square extends Node2D {
  public color: string | CanvasGradient | CanvasPattern;
  public hAlign: HorizontalAlignment;
  public vAlign: VerticalAlignment;

  private _debug = true;

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

    // This isn't correct -- if this is meant to translate it to the correct position
    // it is actually just making the position completely wrong. Should this logic be
    // built into the Bounds struct?
    // "left, top" should mean that northWest === position.
    // "center, center" should mean that northWest === position - halfSize
    // "right, bottom" should mean that northWest === position - size
    let xOffset = 0;
    if (this.hAlign === "center") xOffset = bounds.halfSize.x;
    else if (this.hAlign === "right") xOffset = bounds.size.x;

    let yOffset = 0;
    if (this.vAlign === "top") yOffset = -bounds.halfSize.y;
    else if (this.vAlign === "bottom") xOffset = bounds.halfSize.y;

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
    ctx.strokeRect(bounds.northWest.x, bounds.northWest.y, bounds.size.x, bounds.size.y);

    ctx.restore();
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = this.color;

    const bounds = this.bounds;
    ctx.fillRect(bounds.northWest.x, bounds.northWest.y, bounds.size.x, bounds.size.y);

    ctx.restore();
    if (this._debug) this.renderDebug(ctx);
  }
}
