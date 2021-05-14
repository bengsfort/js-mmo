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

  describe("relative position getters", () => {
    it("getPositionRelativeToParent should add local and parent position", () => {
      const parent = new Transform(new Vector2(10, 0));
      const t = new Transform(new Vector2(5, 15));
      const relativePosition = t.getPositionRelativeToParent(parent);
      expect(relativePosition.x).toEqual(15);
      expect(relativePosition.y).toEqual(15);
    });

    it("getRotationRelativeToParent should add local and parent rotation", () => {
      const parent = new Transform(new Vector2(10, 0));
      const t = new Transform(new Vector2(5, 15));

      parent.rotation = 10;
      t.rotation = 5;

      const relativeRotation = t.getRotationRelativeToParent(parent);
      expect(relativeRotation).toEqual(15);
    });

    it("getScaleRelativeToParent should add local and parent position", () => {
      const parent = new Transform(Vector2.Zero, Vector2.One);
      const parent2 = new Transform(Vector2.Zero, new Vector2(2, 2));
      const t = new Transform(Vector2.Zero, new Vector2(2, 2));

      const relativeScaleBy1 = t.getScaleRelativeToParent(parent);
      expect(relativeScaleBy1.x).toEqual(2);
      expect(relativeScaleBy1.y).toEqual(2);

      const relativeScaleBy2 = t.getScaleRelativeToParent(parent2);
      expect(relativeScaleBy2.x).toEqual(4);
      expect(relativeScaleBy2.y).toEqual(4);
    });
  });
});
