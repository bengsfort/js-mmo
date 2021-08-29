import { Bounds, Node2d, Vector2 } from "@js-mmo/engine";
import { RectDrawable, RendererConfig, createRect, RenderObject } from "@js-mmo/renderer";

let counter = 0;

export class BackgroundBox extends RenderObject<RectDrawable> {
  public color;

  private _defaultColor: string;
  protected _drawable: RectDrawable;

  public get drawable(): RectDrawable {
    this._drawable.data = {
      ...this._drawable.data,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
      color: this.color,
    };
    return this._drawable;
  }

  constructor(pos: Vector2, size = 500, color = "#00f", parent?: Node2d) {
    super(`background_box_${counter++}`);
    this.position = pos;
    this._drawable = createRect({
      position: this.position,
      width: size,
      height: size,
      origin: new Vector2(0.5, 0.5),
      scale: this.scale,
      rotation: this.rotation,
      color: color,
      renderIsometric: false,
    });
    this.color = color;
    this._defaultColor = color;
    this._bounds = new Bounds(pos, new Vector2(size / RendererConfig.PIXEL_RATIO, size / RendererConfig.PIXEL_RATIO));
    if (parent) this.setParent(parent);
  }

  update = () => {
    // this.bounds.size;
    this.color = this._defaultColor;
  };
}
