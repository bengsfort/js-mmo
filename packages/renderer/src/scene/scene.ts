import { Node2d, NodeTypes } from "@js-mmo/engine";

export class Scene extends Node2d {
  type = NodeTypes.Scene;
  background = "transparent";
  isScene = true;
}
