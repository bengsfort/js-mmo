import { Bounds, NodeTypes, SceneObject, Time, Vector2 } from "@js-mmo/engine";
import { RectDrawable, RendererConfig, RenderingNode, createRect } from "@js-mmo/renderer";

let counter = 0;

export class BoundingBox extends SceneObject implements RenderingNode<RectDrawable> {
  public type = NodeTypes.Draw;

  public bounds: Bounds;
  public color;

  private _defaultColor: string;
  private _drawable: RectDrawable;

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

  constructor(pos: Vector2, color = "#00f", parent?: SceneObject) {
    super(`bounding_box_${counter++}`, pos, Vector2.One, 0, parent);
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
    this.bounds = new Bounds(pos, new Vector2(64 / RendererConfig.PIXEL_RATIO, 64 / RendererConfig.PIXEL_RATIO));
  }

  update = () => {
    this.bounds.position = this.localPosition;
    this.bounds.size;
    this.color = this._defaultColor;
  };
}
