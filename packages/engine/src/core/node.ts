import { NodeTypes } from "../constants";

import { makeLogger } from "./logging";

const log = makeLogger("CORE");
let idCounter = 0;

export class Node {
  // Properties
  public readonly id = idCounter++;
  public name: string;

  public type = NodeTypes.Node;
  public parent: Node | undefined;
  public children: Node[];

  private _active: boolean;

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
    this._active = false;
  }

  // Public methods
  public setActive(active: boolean): void {
    if (active !== this._active) {
      this._active = active;
      this.onActive();
    }
  }

  public addChild(child: Node): void {
    if (this.children.includes(child)) {
      log.logError("Can't re-add a node to it's current parent.");
      return;
    }
    if (child === this) {
      log.logError("Can't add a node as a child of itself!");
      return;
    }

    this.children.push(child);
    child.parent = this;
  }

  public remove(node?: Node): void {
    if (!node) {
      this.parent?.remove(this);
      return;
    }
    if (this.children.includes(node)) {
      this.children = this.children.filter(child => child !== node);
      return;
    }
    log.logError("Couldn't remove node, either it doesn't exist or is not a child of the given node.");
  }

  // Overrides
  onActive = (): void => {};
}
