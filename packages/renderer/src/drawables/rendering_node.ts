import { DAttrs } from "./render_drawables";
import { Drawable } from "./drawable";

export interface RenderingNode<T extends Drawable<DAttrs> = Drawable<DAttrs>> {
  type: string;
  drawable: T;
}
