import { Node } from "./node";
import { Transform } from "../math/transform";
import { Vector2 } from "../math/vector2";

export class Node2d extends Node {
  public readonly transform: Transform;

  public parent: Node2d | null = null;
  public children: Node[] = [];

  // Getters
  get localPosition(): Vector2 {
    return this.transform.position;
  }
  get localRotation(): number {
    return this.transform.rotation;
  }
  get localScale(): Vector2 {
    return this.transform.scale;
  }

  get position(): Vector2 {
    const parentPos = this.parent?.position;
    if (parentPos) {
      return Vector2.Add(this.transform.position, parentPos);
    }
    return this.transform.position;
  }
  get rotation(): number {
    const parentRot = this.parent?.rotation;
    if (parentRot) {
      return this.transform.rotation + parentRot;
    }
    return this.transform.rotation;
  }
  get scale(): Vector2 {
    const parentScale = this.parent?.scale;
    if (parentScale) {
      return Vector2.Multiply(this.transform.scale, parentScale);
    }
    return this.transform.scale;
  }

  constructor(name = "", pos = Vector2.Zero, scale = Vector2.One, parent = null) {
    super(name, parent);
    this.transform = new Transform(pos, scale);
  }
}
