import {
  registerFixedUpdateHandler,
  registerPostUpdateHandler,
  registerUpdateHandler,
  removeFixedUpdateHandler,
  removePostUpdateHandler,
  removeUpdateHandler,
} from "../game_loop";

import { makeLogger } from "./logging";

const log = makeLogger("CORE");
let idCounter = 0;

export class Node {
  // Properties
  public readonly id = idCounter++;
  public readonly name: string;

  public type = "node";
  public parent: Node | undefined;
  public children: Node[];

  private _active: boolean;
  private _updateHandlerId = -1;
  private _postUpdateHandlerId = -1;
  private _fixedUpdateHandlerId = -1;

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
      if (active) {
        this._updateHandlerId = registerUpdateHandler(this.update);
        this._postUpdateHandlerId = registerPostUpdateHandler(this.postUpdate);
        this._fixedUpdateHandlerId = registerFixedUpdateHandler(this.fixedUpdate);
      } else {
        removeUpdateHandler(this._updateHandlerId);
        removePostUpdateHandler(this._postUpdateHandlerId);
        removeFixedUpdateHandler(this._fixedUpdateHandlerId);
      }
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
  update = (): void => {};
  postUpdate = (): void => {};
  fixedUpdate = (): void => {};
}
