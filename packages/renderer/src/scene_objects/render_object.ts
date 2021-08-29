import { Bounds, Node2d, SceneObject, Vector2 } from "@js-mmo/engine";

import { NodeTypes } from "../../../engine/build";
import { RenderingNode } from "../drawables/rendering_node";
import { Drawable } from "../drawables/drawable";
import { DAttrs } from "../drawables/render_drawables";

// @todo: Maybe add a `queryType` for objects of type `Query`. This can be: `collision` or `draw`?
export class RenderObject<T extends Drawable<DAttrs> = Drawable<DAttrs>>
  extends SceneObject
  implements RenderingNode<T> {
  public readonly type = NodeTypes.Draw;

  public set size(value: Vector2) {
    this._bounds.size.set(value.x, value.y);
  }
  public get size(): Vector2 {
    return this._bounds.size;
  }

  protected _bounds: Bounds;
  public get bounds(): Bounds {
    this._bounds.position.set(this.position.x, this.position.y);
    return this._bounds;
  }
  protected _drawable!: T;

  public get drawable(): T {
    const bounds = this.bounds;
    this._drawable.data = {
      ...this._drawable.data,
      width: bounds.size.x,
      height: bounds.size.y,
      position: this.bounds.position,
      rotation: this.rotation,
      scale: this.scale,
    };
    return this._drawable;
  }

  constructor(name = "") {
    super(name);

    // @todo: does this need to use pixels_per_unit?
    this._bounds = new Bounds(this.localPosition, Vector2.One);
  }
}
