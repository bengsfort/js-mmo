import { Drawable } from "./drawable";

export interface RenderingNode<T extends Drawable<unknown>> {
  type: string;
  drawable: T;
}
