import { Node2d } from "@js-mmo/engine";

export class Scene extends Node2d {
  type = "scene";
  background = "#000";
  isScene = true;
  activeCamera = null;
}
