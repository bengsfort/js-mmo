import { NodeTypes } from "../constants";

import { EngineEvent, EventDispatcher } from "./event_dispatcher";
import { makeLogger } from "./logging";

const log = makeLogger("CORE");
let idCounter = 0;

export interface NodeAddedEvent extends EngineEvent {
  type: "node_added";
  data: {
    node: Node;
  };
  source: Node;
}

export interface NodeRemovedEvent extends EngineEvent {
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
  // @todo: Remove parent?
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
    // If this is already the parent, early out.
    if (this._parent === parent) {
      return;
    }

    // If provided parent is null, remove.
    if (parent === null) {
      const oldParent = this._parent as Node;
      oldParent.children = oldParent.children.filter(node => node !== this) ?? [];
      this._parent = null;
      this.removeEventListener("node_added", oldParent.onNodeAdded);
      this.removeEventListener("node_removed", oldParent.onNodeRemoved);
      oldParent.dispatchEvent("node_removed", {
        type: "node_removed",
        data: { node: this },
        source: oldParent,
      });
      return;
    }

    // If provided parent is a node, add ourselves to it and store the reference.
    if (this._parent && this._parent !== null) {
      this.setParent(null);
    }

    this._parent = parent;
    parent.children.push(this);
    parent.dispatchEvent("node_added", {
      type: "node_added",
      data: { node: this },
      source: parent,
    });
    this.addEventListener("node_added", parent.onNodeAdded);
    this.addEventListener("node_removed", parent.onNodeRemoved);
  }

  public addChild(node: Node): void {
    node.setParent(this);
  }

  public remove(node?: Node): void {
    // If no node provided, remove this from it's parent.
    if (!node) {
      this.setParent(null);
      return;
    }

    node.setParent(null);
  }

  // Overrides
  onActive(): void {}
  onInactive(): void {}

  // Optional subscriptions
  public onNodeAdded = (ev: NodeAddedEvent) => this._onNodeAdded(ev);
  private _onNodeAdded(ev: NodeAddedEvent): void {
    console.log("Node.onNodeAdded", ev);
    // This is going to allow us to "bubble" the event upwards to the world instance.
    this.dispatchEvent("node_added", ev);
  }

  public onNodeRemoved = (ev: NodeRemovedEvent) => this._onNodeRemoved(ev);
  private _onNodeRemoved(ev: NodeRemovedEvent): void {
    console.log("Scene.onNodeRemoved", ev);
    // This is going to allow us to "bubble" the event upwards to the world instance.
    this.dispatchEvent("node_removed", ev);
  }
}
