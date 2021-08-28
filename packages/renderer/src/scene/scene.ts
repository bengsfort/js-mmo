import { Node2d, NodeTypes, Vector2 } from "@js-mmo/engine";
import { NodeAddedEvent, NodeRemovedEvent } from "@js-mmo/engine/src/core/node";

export class Scene extends Node2d {
  type = NodeTypes.Scene;
  background = "transparent";
  isScene = true;

  constructor(name = "Scene", position = Vector2.Zero) {
    super(name);
    this.position = position;
  }

  public onNodeAdded = (ev: NodeAddedEvent): void => {
    console.log("Scene.onNodeAdded", ev);
    // This is going to allow us to "bubble" the event upwards to the world instance.
    this.dispatchEvent("node_added", ev);
  };

  public onNodeRemoved = (ev: NodeRemovedEvent): void => {
    console.log("Scene.onNodeRemoved", ev);
    // This is going to allow us to "bubble" the event upwards to the world instance.
    this.dispatchEvent("node_removed", ev);
  };
}
