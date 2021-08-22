import { Node2d, NodeTypes, Vector2 } from "@js-mmo/engine";

export class Scene extends Node2d {
  type = NodeTypes.Scene;
  background = "transparent";
  isScene = true;

  constructor(name = "Scene", position = Vector2.Zero) {
    super(name);
    this.position = position;
  }
}
