import { DAttrs } from "./render_drawables";
import { Drawable } from "./drawable";
import { NodeTypes } from "../../../engine/build";

export interface RenderingNode<T extends Drawable<DAttrs> = Drawable<DAttrs>> {
  type: NodeTypes;
  drawable: T;
}
