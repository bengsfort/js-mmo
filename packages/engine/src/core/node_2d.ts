import { Transform } from "../math/transform";
import { Vector2 } from "../math/vector2";

import { Node } from "./node";

/**
 * @todo: Better recursion and tracking of local vs. global transforms (scale, pos, rotation).
 * Realistically, we should try to opt for a single position vector instance.
 *
 * This would mean removing the possibility to update position via something like:
 * ```
 * node.position = new Vector2(5, 5);
 * ```
 *
 * Additionally, we need to update it so that for example updaing the global position via
 * `node.position.set()` or similar, would actually update its global position. This
 * would have to be done via:
 *
 * ```
 * this.localPosition = this.parent.position - newGlobalPosition
 * ```
 *
 * How we do this? Unsure. Either:
 *
 * - Remove `set`
 * - Make all transform getters return the actual vector2 instance?
 *  + This has complications when it comes to, for example, global `position`.
 *  + Those complications mainly revolve around the fact we need to have some
 *    api for actually updating an _instance_ of the vector2, and have those
 *    changes reflected also in the local position. We can maybe do this by
 *    improving the transform API, or adding a new `Position` api that extends
 *    Vector2 and includes a `local` vector2, so it can update that whenever
 *    `set` or any of the other match functions get called.
 *  + Another option would be to add an event system to vector2, but that feels gross.
 * - Force all transform getters to return a copy, and essentially force moving things via
 *   built-in functions like `translate(x, y)`, `scale(x, y)`, etc.
 */
export class Node2d extends Node {
  public readonly transform: Transform;

  public get parent(): Node2d | undefined {
    if (this._parent) return this._parent as Node2d;
  }

  public children: Node[] = [];

  // Getters
  set localPosition(value: Vector2) {
    this.transform.position.set(value.x, value.y);
  }
  get localPosition(): Vector2 {
    return this.transform.position;
  }

  set localRotation(value: number) {
    this.transform.rotation = value;
  }
  get localRotation(): number {
    return this.transform.rotation;
  }

  set localScale(value: Vector2) {
    this.transform.scale.set(value.x, value.y);
  }
  get localScale(): Vector2 {
    return this.transform.scale;
  }

  set position(value: Vector2) {
    this.localPosition = value;
  }
  get position(): Vector2 {
    if (this.parent) {
      const parentPos = this.parent.position.copy();
      return Vector2.Add(this.transform.position, parentPos);
    }
    return this.transform.position;
  }

  set rotation(value: number) {
    this.localRotation = value;
  }
  get rotation(): number {
    if (this.parent) {
      const parentRot = this.parent.rotation;
      return parentRot + this.transform.rotation;
    }
    return this.transform.rotation;
  }

  set scale(value: Vector2) {
    this.localScale = value;
  }
  /**
   * @todo: really need to think of a better way to do this recursion.
   */
  get scale(): Vector2 {
    if (typeof this.parent !== "undefined") {
      const parentScale = this.parent.scale;
      return Vector2.Multiply(this.transform.scale, parentScale);
    }
    return this.transform.scale;
  }

  // Constructor
  constructor(name = "", parent?: Node2d) {
    super(name, parent);
    this.transform = new Transform(Vector2.Zero, Vector2.One, 0);
  }
}
