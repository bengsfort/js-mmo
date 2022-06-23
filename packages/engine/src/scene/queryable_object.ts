import { Bounds } from "../math/bounds";
import { Vector2 } from "../math/vector2";
import { NodeTypes } from "../constants";
import { QueryNode } from "../core/query_node";

import { SceneObject } from "./scene_object";

let idCounter = -1;

// @todo: Maybe add a `queryType` for objects of type `Query`. This can be: `collision` or `draw`?
export class QueryableObject extends SceneObject implements QueryNode {
  public readonly type = NodeTypes.Query;

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

  constructor(position: Vector2, size: Vector2, name = `query_node:${++idCounter}`) {
    super(name);
    this.position = position;
    this._bounds = new Bounds(this.position, size);
  }
}
