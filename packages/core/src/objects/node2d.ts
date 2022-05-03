import { Log } from "../logs";
import { EventEmitter } from "../events";
import { ChildAddedEvent, ChildRemovedEvent, Transform, Vector2 } from "../math";

import { NodeTypes } from "./node_types";

const { verboseLogInfo } = Log.makeLogger("CORE");

let idCounter = 0;

export interface NodeEvents {
  node_added: [parent: Node2D, child: Node2D];
  node_removed: [parent: Node2D, child: Node2D];
}
export class Node2D extends EventEmitter<NodeEvents> {
  // Properties
  public readonly id: number;
  public readonly type: NodeTypes | string;
  public name: string;

  // State
  public readonly transform: Transform<Node2D>;
  private _active: boolean;

  constructor(name?: string) {
    super();

    this.id = idCounter++;
    this.type = NodeTypes.Node;
    this.name = name ?? `Node ${this.id}`;

    this.transform = new Transform();
    this.transform.owner = this;
    this.transform.on("child_added", this._onNodeAdded);
    this.transform.on("child_removed", this._onNodeRemoved);
    this._active = false;
  }

  // Transform getters
  public set position(value: Vector2) {
    this.transform.position.set(value.x, value.y);
  }
  public get position(): Vector2 {
    return this.transform.position;
  }

  public set scale(value: Vector2) {
    this.transform.scale.set(value.x, value.y);
  }
  public get scale(): Vector2 {
    return this.transform.scale;
  }

  public set rotation(value: number) {
    this.transform.rotation = value;
  }
  public get rotation(): number {
    return this.transform.rotation;
  }

  public getWorldPosition(): Vector2 {
    return this.transform.getWorldPosition();
  }

  public getWorldScale(): Vector2 {
    return this.transform.getWorldScale();
  }

  public getWorldRotation(): number {
    return this.transform.rotation;
  }

  // Active
  public get active(): boolean {
    return this._active;
  }
  public set active(isActive: boolean) {
    if (isActive === this._active) return;

    this._active = isActive;
    if (isActive) this._onActive();
    else this._onInactive();
  }

  // Parenting
  public get parent(): Node2D | null {
    return (this.transform.parent?.owner as Node2D) ?? null;
  }

  public get children(): Node2D[] {
    if (this.transform.children.length === 0) return [];
    // @todo: Performance profile this.
    return this.transform.children.map(transform => transform.owner as Node2D);
  }

  public setParent(node: Node2D | null): void {
    this.transform.setParent(node?.transform ?? null);
  }

  public addChild(node: Node2D): void {
    this.transform.addChild(node.transform);
    node.transform.on("child_added", this._onNodeAdded);
    node.transform.on("child_removed", this._onNodeRemoved);
  }

  public remove(node: Node2D | null): void {
    node?.transform.removeListener("child_added", this._onNodeAdded);
    node?.transform.removeListener("child_removed", this._onNodeRemoved);
    this.transform.remove(node?.transform);
  }

  // Overrides
  protected _onActive(): void {}
  protected _onInactive(): void {}

  // Subscriptions
  private _onNodeAdded = (ev: ChildAddedEvent) => {
    verboseLogInfo("Node.onNodeAdded", ev);
    // This is going to allow us to "bubble" the event upwards to the world instance.
    this.emit("node_added", ev.parent.owner as Node2D, ev.child.owner as Node2D);
  };

  private _onNodeRemoved = (ev: ChildRemovedEvent) => {
    verboseLogInfo("Node.onNodeRemoved", ev);
    // This is going to allow us to "bubble" the event upwards to the world instance.
    this.emit("node_removed", ev.parent.owner as Node2D, ev.child.owner as Node2D);
  };
}