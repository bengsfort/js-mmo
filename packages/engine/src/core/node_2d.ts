import { Transform } from "../math/transform";
import { Vector2 } from "../math/vector2";

import { Node } from "./node";

export class Node2d extends Node {
  public readonly transform: Transform;

  public parent: Node2d | undefined;
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
      return this.transform.getPositionRelativeToParent(this.parent.transform);
    }
    return this.transform.position;
  }

  set rotation(value: number) {
    this.localRotation = value;
  }
  get rotation(): number {
    if (this.parent) {
      return this.transform.getRotationRelativeToParent(this.parent.transform);
    }
    return this.transform.rotation;
  }

  set scale(value: Vector2) {
    this.localScale = value;
  }
  get scale(): Vector2 {
    if (this.parent) {
      return this.transform.getScaleRelativeToParent(this.parent.transform);
    }
    return this.transform.scale;
  }

  // Constructor
  constructor(name = "", pos = Vector2.Zero, scale = Vector2.One, parent?: Node2d) {
    super(name, parent);
    this.transform = new Transform(pos, scale);
  }
}
