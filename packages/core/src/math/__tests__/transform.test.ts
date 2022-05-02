import { Transform } from "../transform";
import { Vector2 } from "../vector2";

describe("Transform", () => {
  it("should have a valid position, rotation, and scale", () => {
    const position = new Vector2(35, 35);
    const scale = Vector2.One;
    const t = new Transform(position, scale);
    expect(t).toBeInstanceOf(Transform);
    expect(t).toHaveProperty("position", position);
    expect(t).toHaveProperty("scale", scale);
    expect(t).toHaveProperty("rotation", 0);
  });

  it("should default to pos 0,0 and scale 1,1", () => {
    const t = new Transform();
    expect(t.position.x).toEqual(0);
    expect(t.position.y).toEqual(0);
    expect(t.scale.x).toEqual(1);
    expect(t.scale.y).toEqual(1);
  });

  describe("ownership", () => {
    it("should init with no parent or children", () => {
      const t = new Transform();
      expect(t.parent).toBeNull();
      expect(t.children).toHaveLength(0);
    });

    it("should update childrens parent", () => {
      const parent = new Transform();
      const child = new Transform();

      expect(child.parent).toBeNull();
      child.setParent(parent);
      expect(child.parent).toEqual(parent);
      expect(parent.hasChild(child)).toEqual(true);
      child.remove();
      expect(child.parent).toBeNull();
    });

    it("should add and remove children", () => {
      const parent = new Transform();
      const child = new Transform();

      expect(parent.children).toHaveLength(0);

      parent.addChild(child);
      expect(child.parent).toEqual(parent);
      expect(parent.hasChild(child)).toEqual(true);
      expect(parent.children).toHaveLength(1);

      parent.remove(child);
      expect(child.parent).toBeNull();
      expect(parent.hasChild(child)).toEqual(false);
      expect(parent.children).toHaveLength(0);
    });

    it("should not allow a transform to set itself as a child or parent", () => {
      const transform = new Transform();

      transform.setParent(transform);
      expect(transform.parent).toBeNull();
      expect(transform.children).toHaveLength(0);

      transform.addChild(transform);
      expect(transform.parent).toBeNull();
      expect(transform.children).toHaveLength(0);
    });
  });

  describe("world position helpers", () => {
    it("getWorldPosition should recursively add local and parent position", () => {
      const parent = new Transform(new Vector2(10, 0));
      const t = new Transform(new Vector2(5, 15));
      t.setParent(parent);

      const worldPos = t.getWorldPosition();
      expect(worldPos.x).toEqual(15);
      expect(worldPos.y).toEqual(15);
    });

    it("getWorldRotation should recursively add local and parent rotation", () => {
      const parent = new Transform(new Vector2(10, 0));
      const t = new Transform(new Vector2(5, 15));
      t.setParent(parent);

      parent.rotation = 10;
      t.rotation = 5;

      const worldRot = t.getWorldRotation();
      expect(worldRot).toEqual(15);
    });

    it("getWorldScale should recursively multiply local and parent scale", () => {
      const parent = new Transform(Vector2.Zero, Vector2.One);
      const parent2 = new Transform(Vector2.Zero, new Vector2(2, 2));
      const t = new Transform(Vector2.Zero, new Vector2(2, 2));

      t.setParent(parent);
      const relativeScaleBy1 = t.getWorldScale();
      expect(relativeScaleBy1.x).toEqual(2);
      expect(relativeScaleBy1.y).toEqual(2);

      parent.setParent(parent2);
      const relativeScaleBy2 = t.getWorldScale();
      expect(relativeScaleBy2.x).toEqual(4);
      expect(relativeScaleBy2.y).toEqual(4);
    });
  });

  describe("Events", () => {
    const parent = new Transform<string>();
    parent.owner = "Parent";

    beforeEach(() => {});
  });
});
