import { Vector2 } from "../vector2";

describe("Vector2", () => {
  it("should store 2d vectors", () => {
    const vec2 = new Vector2(5, 10);
    expect(vec2).toBeInstanceOf(Vector2);
    expect(vec2.x).toEqual(5);
    expect(vec2.y).toEqual(10);
  });

  it("should have unique ids for tracking", () => {
    const vec2_1 = new Vector2(3, 3);
    const vec2_2 = new Vector2(5, 5);
    expect(vec2_1.id).not.toEqual(vec2_2.id);
  });

  it("should expose the magnitude of the vector", () => {
    expect(new Vector2(10, 10).magnitude).toEqual(200);
    expect(new Vector2(0, 0).magnitude).toEqual(0);
    expect(new Vector2(5, 10).magnitude).toEqual(125);
    expect(new Vector2(10, 5).magnitude).toEqual(125);
  });

  it("should copy itself to a new vector2", () => {
    const original = new Vector2(327.5, 21);
    const copy = original.copy();
    expect(copy.x).toEqual(original.x);
    expect(copy.y).toEqual(original.y);
    expect(copy.id).not.toEqual(original.id);
  });

  describe("builtins", () => {
    it(".add should add its values with the given vector", () => {
      const vec2_1 = new Vector2(0, 0);
      const vec2_2 = new Vector2(10, 5);
      expect(vec2_1.x).toEqual(0);
      expect(vec2_1.y).toEqual(0);

      vec2_1.add(vec2_2);
      expect(vec2_1.x).toEqual(10);
      expect(vec2_1.y).toEqual(5);
    });

    it(".multiply should multiply its values with the given number", () => {
      const vec2_1 = new Vector2(1, 1);
      expect(vec2_1.x).toEqual(1);
      expect(vec2_1.y).toEqual(1);

      vec2_1.multiply(5);
      expect(vec2_1.x).toEqual(5);
      expect(vec2_1.y).toEqual(5);
    });

    it(".equals should check value equality with the given vector", () => {
      const original = new Vector2(300, 300);
      const notEqual = new Vector2(500, 420);
      const equal = new Vector2(300, 300);

      expect(original.equals(notEqual)).toEqual(false);
      expect(original.equals(equal)).toEqual(true);
    });
  });

  describe("static helpers", () => {
    it("Vector2.Add should return a new vector with the sum of the given vectors", () => {
      const v1 = new Vector2(5, 5);
      const v2 = new Vector2(10, 20);
      const result = Vector2.Add(v1, v2);

      // make sure they didnt get altered
      expect(v1.x).toEqual(5);
      expect(v1.y).toEqual(5);
      expect(v2.x).toEqual(10);
      expect(v2.y).toEqual(20);

      expect(result.x).toEqual(15);
      expect(result.y).toEqual(25);
    });

    it("Vector2.Subtract should return a new vector with the difference of the given vectors", () => {
      const v1 = new Vector2(5, 5);
      const v2 = new Vector2(10, 20);
      const result = Vector2.Subtract(v1, v2);

      // make sure they didnt get altered
      expect(v1.x).toEqual(5);
      expect(v1.y).toEqual(5);
      expect(v2.x).toEqual(10);
      expect(v2.y).toEqual(20);

      expect(result.x).toEqual(-5);
      expect(result.y).toEqual(-15);
    });

    it("Vector2.Multiply should return a new vector with the product of the given vectors", () => {
      const v1 = new Vector2(5, 5);
      const v2 = new Vector2(10, 20);
      const result = Vector2.Multiply(v1, v2);

      // make sure they didnt get altered
      expect(v1.x).toEqual(5);
      expect(v1.y).toEqual(5);
      expect(v2.x).toEqual(10);
      expect(v2.y).toEqual(20);

      expect(result.x).toEqual(50);
      expect(result.y).toEqual(100);
    });

    it("Vector2.Divide should return a new vector with the quotient of the given vectors", () => {
      const v1 = new Vector2(5, 5);
      const v2 = new Vector2(10, 20);
      const result = Vector2.Divide(v1, v2);

      // make sure they didnt get altered
      expect(v1.x).toEqual(5);
      expect(v1.y).toEqual(5);
      expect(v2.x).toEqual(10);
      expect(v2.y).toEqual(20);

      expect(result.x).toEqual(0.5);
      expect(result.y).toEqual(0.25);
    });
  });
});
