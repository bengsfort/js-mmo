import { EngineEvent } from "../events";

import type { Node2D } from "./node2d";

export interface NodeAddedEvent extends EngineEvent {
  type: "node_added";
  data: {
    node: Node2D;
  };
  source: Node2D;
}

export interface NodeRemovedEvent extends EngineEvent {
  type: "node_removed";
  data: {
    node: Node2D;
  };
  source: Node2D;
}

export interface NodeEvents {
  node_added: NodeAddedEvent;
  node_removed: NodeRemovedEvent;
}
