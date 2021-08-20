import { SceneObject } from "../scene/scene_object";
import { NodeTypes } from "../constants";
import { Vector2 } from "../math/vector2";
import { Bounds } from "../world/bounds";
import { Node2d } from "../core/node_2d";

// @todo: How the fuck does this update and stay synced with its connected node??
export class PhysicsBody extends SceneObject {
  type = NodeTypes.Physics;
  private _bounds: Bounds;

  public get boundaries(): Bounds {
    return this._bounds;
  }
  public get size(): Vector2 {
    return this._bounds.size;
  }

  constructor(pos: Vector2, size: Vector2, parent?: Node2d) {
    super(`${parent?.name ?? ""}:physbody`, pos, Vector2.One, 0, parent);
    this._bounds = new Bounds(pos, size);
  }

  // @todo? Math n shit?? velocities???
}
