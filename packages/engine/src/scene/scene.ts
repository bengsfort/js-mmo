import { Node2d } from "../core/node_2d";

export class Scene extends Node2d {
  type = "scene";
  background = "#000";
  isScene = true;
  activeCamera = null;
}
