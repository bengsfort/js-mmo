import { Vector2 } from "../math";

export class Transform {
  position: Vector2;
  rotation: number;
  scale: Vector2;

  // Local
  private _localPosition: Vector2;
  private _localRotation: number;
  private _localScale: Vector2;

  // Ownership
  private _parent: Transform | null = null;
  private _children: Transform[] = [];

  public get parent(): Transform | null {
    return this._parent;
  }

  public get children(): Transform[] {
    return [...this._children];
  }

  constructor(pos = new Vector2(0, 0), scale = new Vector2(1, 1), rotation = 0) {
    this.position = pos;
    this.rotation = rotation;
    this.scale = scale;

    this._localPosition = pos.copy();
    this._localRotation = rotation;
    this._localScale = scale.copy();
  }

  public remove(transform: Transform): void {}

  public setParent(parent: Transform | null): void {}

  public hasChild(child: Transform): boolean {
    return this._children.includes(child);
  }

  public getPositionRelativeToParent(parent: Transform): Vector2 {
    return Vector2.Add(this.position, parent.position);
  }

  public getRotationRelativeToParent(parent: Transform): number {
    return this.rotation + parent.rotation;
  }

  public getScaleRelativeToParent(parent: Transform): Vector2 {
    return Vector2.Multiply(this.scale, parent.scale);
  }
}
