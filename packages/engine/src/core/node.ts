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
  protected _parent?: Node;
  public get parent(): Node | undefined {
    return this._parent;
  }
  public set parent(value: Node | undefined) {
    if (value) {
      value.addChild(this);
    } else {
      this._parent?.remove(this);
    }
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
    parent?.addChild(this);
  }

  // Public methods
  public setActive(active: boolean): void {
    if (active !== this._active) {
      this._active = active;
      if (active) this.onActive();
      else this.onInactive();
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
    if (typeof child.parent !== "undefined") {
      console.log("Re-parenting:", child, child.parent);
      child.parent.remove(child);
    }

    this.dispatchEvent("node_added", {
      type = "node_added",
      data: {
        node: child,
      },
      source: this,
    });
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
  onActive(): void {}
  onInactive(): void {}
}
