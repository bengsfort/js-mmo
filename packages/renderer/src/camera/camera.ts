import { Node2d, NodeTypes, TiledOrientation } from "@js-mmo/engine";

export class Camera extends Node2d {
  type = NodeTypes.Camera;
  zoom = 1;
  orientation = TiledOrientation.Isometric;
}
