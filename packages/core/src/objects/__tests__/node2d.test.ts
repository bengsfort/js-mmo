import { Vector2 } from "../../math";
import { Node2D } from "../node2d";

describe("Node2D", () => {
  it("should have a transform with position and scale", () => {
    const pos = new Vector2(5, 5);
    const scale = new Vector2(1.5, 1.5);

    const node = new Node2D();
    node.position.set(pos.x, pos.y);
    node.scale.set(scale.x, scale.y);
    node.rotation = 5;

    expect(node).toHaveProperty("transform");
    expect(node.transform.position.toLiteral()).toEqual(pos.toLiteral());
    expect(node.transform.scale.toLiteral()).toEqual(scale.toLiteral());
  });
});
