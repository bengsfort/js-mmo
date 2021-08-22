import { NodeTypes, QueryNode } from "@js-mmo/engine";

import { DAttrs } from "./render_drawables";
import { Drawable } from "./drawable";

export interface RenderingNode<T extends Drawable<DAttrs> = Drawable<DAttrs>> extends QueryNode {
  drawable: T;
}
