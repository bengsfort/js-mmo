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

    it("should provide the length of the vector", () => {
      const vec2 = new Vector2(6, 8);
      expect(vec2).toHaveLength(10);
    });

    it(".multiplyScalar should multiply its values with the given number", () => {
      const vec2_1 = new Vector2(1, 1);
      expect(vec2_1.x).toEqual(1);
      expect(vec2_1.y).toEqual(1);

      vec2_1.multiply({ x: 5, y: 10 });
      expect(vec2_1.x).toEqual(5);
      expect(vec2_1.y).toEqual(10);
    });

    it(".multiply should multiply its values with the given vector2", () => {
      const vec2_1 = new Vector2(1, 1);
      expect(vec2_1.x).toEqual(1);
      expect(vec2_1.y).toEqual(1);

      vec2_1.multiplyScalar(5);
      expect(vec2_1.x).toEqual(5);
      expect(vec2_1.y).toEqual(5);
    });

    it(".divideScalar should divide its values with the given number", () => {
      const vec2 = new Vector2(10, 10);
      vec2.divideScalar(5);
      expect(vec2.x).toEqual(2);
      expect(vec2.y).toEqual(2);
    });

    it(".divide should divide its values with the given vector2", () => {
      const vec2 = new Vector2(10, 10);
      vec2.divide({ x: 2, y: 5 });
      expect(vec2.x).toEqual(5);
      expect(vec2.y).toEqual(2);
    });

    it(".equals should check value equality with the given vector", () => {
      const original = new Vector2(300, 300);
      const notEqual = new Vector2(500, 420);
      const equal = new Vector2(300, 300);

      expect(original.equals(notEqual)).toEqual(false);
      expect(original.equals(equal)).toEqual(true);
    });

    it("should lerp to a new vector", () => {
      const original = new Vector2(0, 0);
      const target = new Vector2(100, 100);

      original.lerp(target, 0.5);
      expect(original.x).toEqual(50);
      expect(original.y).toEqual(50);
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

    it("Vector2.Equals should check whether two vectors are equal", () => {
      const v1 = new Vector2(5, 5);
      const v2 = new Vector2(10, 5);
      const v3 = new Vector2(5, 5);

      expect(Vector2.Equals(v1, v2)).toEqual(false);
      expect(Vector2.Equals(v1, v3)).toEqual(true);
    });

    it("Should provide static generators for the directions", () => {
      const down = Vector2.Down;
      expect(down.x).toEqual(0);
      expect(down.y).toEqual(-1);

      const up = Vector2.Up;
      expect(up.x).toEqual(0);
      expect(up.y).toEqual(1);

      const left = Vector2.Left;
      expect(left.x).toEqual(-1);
      expect(left.y).toEqual(0);

      const right = Vector2.Right;
      expect(right.x).toEqual(1);
      expect(right.y).toEqual(0);
    });

    it("Should provide a helper to lerp between two vectors", () => {
      const v1 = new Vector2(5, 5);
      const v2 = new Vector2(10, 10);
      const result = Vector2.Lerp(v1, v2, 0.5);
      expect(result.x).toEqual(7.5);
      expect(result.y).toEqual(7.5);
    });

    it("Should normalize a vector", () => {
      const v1 = new Vector2(5, 5);
      expect(Vector2.Normalize(v1).length).toBeCloseTo(1);
      const v2 = new Vector2(10, 5);
      expect(Vector2.Normalize(v2).length).toBeCloseTo(1);
    });
  });
});
