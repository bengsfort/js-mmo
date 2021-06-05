import { RenderingNode } from "../drawables/rendering_node";
import { SceneObject } from "@js-mmo/engine";

export class Tilemap extends SceneObject implements RenderingNode {
  readonly type = "draw";
}
