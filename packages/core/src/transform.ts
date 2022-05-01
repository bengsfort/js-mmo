import { Vector2 } from "./math";

export class Transform {
  position: Vector2;
  rotation: number;
  scale: Vector2;

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
  }

  public remove(transform?: Transform): void {
    if (!transform) {
      this._parent?.remove(this);
      return;
    }

    const index = this._children.indexOf(transform);
    if (index > -1) {
      this._children.splice(index, 1);
    } else {
      console.warn("Couldn't remove child as it was not found!");
    }
  }

  public setParent(parent: Transform | null): void {
    if (parent === this._parent) return;

    if (this._parent !== null) {
      this._parent.remove(this);
    }

    this._parent = parent;
    parent?.addChild(this);
  }

  public addChild(child: Transform) {
    if (!this.hasChild(child)) {
      this._children.push(child);
    }

    if (child.parent !== this) {
      child.setParent(this);
    }
  }

  public hasChild(child: Transform): boolean {
    return this._children.includes(child);
  }

  public getWorldPosition(): Vector2 {
    if (this._parent) {
      return Vector2.Add(this.position, this._parent.getWorldPosition());
    }
    return this.position.copy();
  }

  public getWorldRotation(): number {
    return this.rotation + (this._parent?.getWorldRotation() ?? 0);
  }

  public getWorldScale(): Vector2 {
    if (this._parent) {
      return Vector2.Multiply(this.scale, this._parent.getWorldScale());
    }
    return this.scale.copy();
  }
}
