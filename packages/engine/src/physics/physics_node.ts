import { NodeTypes } from "../constants";
import { Bounds } from "../world/bounds";

export interface PhysicsNode {
  type: NodeTypes;
  bounds: Bounds;
}
