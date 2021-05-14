import { registerUpdateHandler, removeUpdateHandler } from "../game_loop";

let idCounter = 0;

export class Node {
  // Properties
  public readonly id = idCounter++;
  public readonly name: string;

  public parent: Node | undefined;
  public children: Node[];

  private _active: boolean;
  private _updateHandlerId = -1;

  // Getters
  get isActive(): boolean {
    return this._active;
  }
  get childCount(): number {
    return this.children.length;
  }

  // Constructor
  constructor(name = "", parent?: Node) {
    this.name = name || this.id.toString();
    this.parent = parent;
    this.parent?.addChild(this);
    this.children = [];
    this._active = true;
  }

  // Public methods
  public setActive(active: boolean): void {
    if (active !== this._active) {
      if (active) {
        this._updateHandlerId = registerUpdateHandler(this.update);
      } else {
        removeUpdateHandler(this._updateHandlerId);
      }
      this._active = active;
      this.onActive();
    }
  }

  public addChild(child: Node): void {
    if (this.children.includes(child)) return;
    this.children.push(child);
    child.parent = this;
  }

  // Overrides
  onActive = (): void => {};
  update = (): void => {};
}
