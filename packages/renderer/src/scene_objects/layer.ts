import { Node2d, NodeTypes } from "@js-mmo/engine";

export class Layer extends Node2d {
  type = NodeTypes.Layer;
  isScene = false;
  isIsometric = false;
}
