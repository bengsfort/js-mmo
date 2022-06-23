import { Bounds } from "../math/bounds";
import { NodeTypes } from "../constants";

export interface QueryNode {
  type: NodeTypes;
  bounds: Bounds;
  // @todo: Might need to add more stuff here
}
