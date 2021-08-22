import { NodeTypes } from "../constants";
import { Bounds } from "../math/bounds";

export interface PhysicsNode {
  type: NodeTypes;
  bounds: Bounds;
}
