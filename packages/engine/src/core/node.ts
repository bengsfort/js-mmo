import { NodeTypes } from "../constants";

import { EngineEvent, EventDispatcher } from "./event_dispatcher";
import { makeLogger } from "./logging";

const log = makeLogger("CORE");
let idCounter = 0;

interface NodeAddedEvent extends EngineEvent {
  type: "node_added";
  data: {
    node: Node;
  };
  source: Node;
}

interface NodeRemovedEvent extends EngineEvent {
  type: "node_removed";
  data: {
    node: Node;
  };
  source: Node;
}

interface NodeEvents {
  node_added: NodeAddedEvent;
  node_removed: NodeRemovedEvent;
}

// @todo: Maybe if this is a root node (scene), when a `child` is added, it tells the scene graph?
// same as when it is removed....
// @todo: OR add a `dirty` flag? That way we can do partial tree updates?
export class Node extends EventDispatcher<NodeEvents> {
  // Properties
  public readonly id = idCounter++;
  public name: string;

  public type = NodeTypes.Node;
  protected _parent: Node | null = null;
  public get parent(): Node | undefined {
    if (this._parent) return this._parent;
  }

  public children: Node[] = [];

  protected _active = false;

  // Getters
  get isActive(): boolean {
    return this._active;
  }
  get childCount(): number {
    return this.children.length;
  }

  // Constructor
  constructor(name = "", parent?: Node) {
    super();
    this.name = name || this.id.toString();
    if (parent) this.setParent(parent);
  }

  // Public methods
  public setActive(active: boolean): void {
    if (active !== this._active) {
      this._active = active;
      if (active) this.onActive();
      else this.onInactive();
    }
  }

  public setParent(parent: Node | null): void {
    if (this._parent === parent) {
      return;
    }

    this._parent?.remove(this);
    this._parent = parent;
    parent?.addChild(this);
  }

  public addChild(node: Node): void {
    if (this.children.includes(node)) {
      log.logError("Can't re-add a node to it's current parent.");
      return;
    }
    if (node === this) {
      log.logError("Can't add a node as a child of itself!");
      return;
    }
    if (typeof node.parent !== "undefined") {
      if (node.parent !== this) node.parent.remove(node);
    }

    this.dispatchEvent("node_added", {
      type: "node_added",
      data: { node },
      source: this,
    });
    this.children.push(node);

    // Should never happen, but to be safe
    if (node.parent !== this) {
      node.setParent(this);
    }
  }

  public remove(node?: Node): void {
    if (!node) {
      this.parent?.remove(this);
      return;
    }
    if (this.children.includes(node)) {
      this.children = this.children.filter(child => child !== node);
      node.setParent(null);
      this.dispatchEvent("node_removed", {
        type: "node_removed",
        data: { node },
        source: this,
      });
      return;
    }
    log.logError("Couldn't remove node, either it doesn't exist or is not a child of the given node.");
  }

  // Overrides
  onActive(): void {}
  onInactive(): void {}
}
