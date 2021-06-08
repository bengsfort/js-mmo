import { Node2d, TiledOrientation } from "@js-mmo/engine";

export class Camera extends Node2d {
  type = "Camera";
  zoom = 1;
  orientation = TiledOrientation.Isometric;
}
