import { RectDrawable, RenderingNode, createRect } from "@js-mmo/renderer";
import { NodeTypes, SceneObject, Vector2 } from "@js-mmo/engine";

export class Box extends SceneObject implements RenderingNode<RectDrawable> {
  public type = NodeTypes.Draw;
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

  constructor(
    pos: Vector2,
    origin: Vector2,
    color: string,
    height: number,
    width: number,
    parent?: Node2d | undefined
  ) {
    super(`box`, pos, Vector2.One, 0, parent);
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
  }
}
