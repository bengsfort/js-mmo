import { RectDrawable, createRect, RenderObject } from "@js-mmo/renderer";
import { Bounds, Node2d, Vector2 } from "@js-mmo/engine";

export class Box extends RenderObject<RectDrawable> {
  private _drawable: RectDrawable;

  public get drawable(): RectDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
    };
    return this._drawable;
  }

  constructor(pos: Vector2, origin: Vector2, color: string, height: number, width: number, parent?: Node2d) {
    super(`box`);
    this.position = pos;
    this._bounds = new Bounds(pos, new Vector2(width, height));
    this._drawable = createRect({
      position: this.position,
      width,
      height,
      color,
      origin,
      scale: this.scale,
      rotation: this.rotation,
      renderIsometric: false,
    });
    if (parent) this.setParent(parent);
  }
}
