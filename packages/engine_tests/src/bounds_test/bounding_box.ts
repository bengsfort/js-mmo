import { Bounds, GameWorld, Node2d, Vector2 } from "@js-mmo/engine";
import { RectDrawable, RendererConfig, createRect, RenderObject } from "@js-mmo/renderer";

let counter = 0;

export class BoundingBox extends RenderObject<RectDrawable> {
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

  constructor(pos: Vector2, color = "#00f", parent?: Node2d) {
    super(`bounding_box_${counter++}`);
    this.position = pos;
    this._drawable = createRect({
      position: this.position,
      width: 64,
      height: 64,
      origin: new Vector2(0.5, 0.5),
      scale: this.scale,
      rotation: this.rotation,
      color: color,
      renderIsometric: false,
    });
    this.color = color;
    this._defaultColor = color;
    this._bounds = new Bounds(pos, new Vector2(64 / RendererConfig.PIXEL_RATIO, 64 / RendererConfig.PIXEL_RATIO));
    if (parent) this.setParent(parent);
  }

  update = () => {
    // this.bounds.position = this.localPosition;
    const hitResults = GameWorld.queryRegion(this.bounds);
    if (hitResults.length > 1) {
      this.color = "#f00";
    } else {
      // console.log("Only got", hitResults.length, "hits");
      this.color = this._defaultColor;
    }
    // if (GameWorld.queryRegion(this.bounds)) {}
    // this.color = this._defaultColor;
  };
}
