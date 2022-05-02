import { Log } from "../logs";
import { EventDispatcher } from "../events";

import type { NodeEvents } from "./node_events";

const { verboseLogInfo } = Log.makeLogger("CORE");

let idCounter = 0;

export class Node2D extends EventDispatcher<NodeEvents> {
  // Properties
  public readonly id: number;
  public name: string;

  // State
  protected _active: boolean;
  // transform...
  // type...

  constructor(name?: string) {
    super();
    this.id = idCounter++;
    this.name = name ?? `Node ${this.id}`;
    this._active = false;
  }

  // set active..
  // parenting..
  // overrides (onActive, onInactive)...
  // onNodeAdded...
  // onRemoved...
}
