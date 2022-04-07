import { Vector2 } from "../../math/vector2";
import { Node2d } from "../node_2d";

describe("Node2d", () => {
  it("should return `undefined` if is root node", () => {
    const node = new Node2d("root");
    expect(node.parent).toBeUndefined();
  });

  it("should pass position and scale to it's transform", () => {
    const pos = new Vector2(5, 5);
    const scale = new Vector2(1.5, 1.5);
    const node = new Node2d("root");
    node.position = pos;
    node.scale = scale;
    expect(node).toHaveProperty("transform");

    // Check shorthand
    expect(node.localPosition.toLiteral()).toEqual(pos.toLiteral());
    expect(node.localScale.toLiteral()).toEqual(scale.toLiteral());

    // Check longhand
    const transform = node.transform;
    expect(transform.position.toLiteral()).toEqual(pos.toLiteral());
    expect(transform.scale.toLiteral()).toEqual(scale.toLiteral());
  });

  it("should contain references for children and parent nodes", () => {
    const root = new Node2d("root");
    const child1 = new Node2d("child1", root);
    const child2 = new Node2d("child2", child1);
    const child3 = new Node2d("child3", child1);

    // Check root...
    expect(root.parent).toBeUndefined();
    expect(root.children).toHaveLength(1);
    expect(root.children[0].id).toEqual(child1.id);

    // Check child1...
    expect(child1.parent).not.toBeUndefined();
    expect(child1.parent?.id).toEqual(root.id);
    expect(child1.childCount).toEqual(2);
    expect(child1.children[0].id).toEqual(child2.id);
    expect(child1.children[1].id).toEqual(child3.id);

    // Check child2
    expect(child2.parent?.id).toEqual(child1.id);
    expect(child2.childCount).toEqual(0);
    expect(child2.children).toHaveLength(0);

    // Check child3
    expect(child3.parent?.id).toEqual(child1.id);
    expect(child3.childCount).toEqual(0);
    expect(child3.children).toHaveLength(0);
  });

  it("should return transform vectors relative to parents", () => {
    const root = new Node2d("root");
    const child1 = new Node2d("child1", root);
    child1.position = new Vector2(5, 5);
    child1.scale = new Vector2(1.5, 1.5);

    // Check that no parent still returns correctly
    expect(root.position.x).toEqual(0);
    expect(root.position.y).toEqual(0);
    expect(root.scale.x).toEqual(1);
    expect(root.scale.x).toEqual(1);
    expect(root.rotation).toEqual(0);

    // Check level one...
    expect(child1.position.x).toEqual(5);
    expect(child1.position.y).toEqual(5);
    expect(child1.scale.x).toEqual(1.5);
    expect(child1.scale.x).toEqual(1.5);
    expect(child1.rotation).toEqual(0);

    // Move root and check results...
    root.position.set(5, 2);
    expect(child1.parent).toEqual(root);
    expect(child1.position.x).toEqual(10);
    expect(child1.position.y).toEqual(7);

    // Scale root and check results...
    root.scale.set(2, 2);
    expect(child1.scale.x).toEqual(3);
    expect(child1.scale.y).toEqual(3);

    // Rotate root and check results...
    root.rotation = 5;
    child1.rotation = 10;
    expect(child1.localRotation).toEqual(10);
    expect(child1.rotation).toEqual(15);
  });
});
