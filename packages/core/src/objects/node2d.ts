import { Log } from "../logs";
import { EventDispatcher } from "../events";
import { Transform, Vector2 } from "../math";

import type { NodeAddedEvent, NodeEvents, NodeRemovedEvent } from "./node_events";
import { NodeTypes } from "./node_types";

const { verboseLogInfo } = Log.makeLogger("CORE");

let idCounter = 0;

export class Node2D extends EventDispatcher<NodeEvents> {
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
  public setParent(node: Node2D | null): void {
    this.transform.setParent(node?.transform ?? null);
  }

  public addChild(node: Node2D): void {
    this.transform.addChild(node.transform);
  }

  // Overrides
  protected _onActive(): void {}
  protected _onInactive(): void {}

  // Subscriptions
  protected _onNodeAdded = (ev: NodeAddedEvent) => {
    console.log("Node.onNodeAdded", ev);
    // This is going to allow us to "bubble" the event upwards to the world instance.
    this.dispatchEvent("node_added", ev);
  };

  protected _onNodeRemoved = (ev: NodeRemovedEvent) => {
    console.log("Node.onNodeRemoved", ev);
    // This is going to allow us to "bubble" the event upwards to the world instance.
    this.dispatchEvent("node_removed", ev);
  };

  // parenting..
}
