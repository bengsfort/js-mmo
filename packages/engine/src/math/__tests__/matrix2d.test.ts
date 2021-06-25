import { Matrix2D } from "../matrix2d";
import { Vector2 } from "../vector2";

describe("Matrix2D", () => {
  it("Should store a 2D matrix", () => {
    const m1 = new Matrix2D(1, 0, 0, 1, 5, 5);
    expect(m1).toBeInstanceOf(Matrix2D);
    expect(m1.values).toEqual([1, 0, 0, 1, 5, 5, 0, 0, 1]);
  });

  it("Should allow accessing matrix values via indices", () => {
    const m1 = new Matrix2D(1, 0, 0, 0, 1, 0);
    // First row
    expect(m1[0]).toEqual(1);
    expect(m1[1]).toEqual(0);
    expect(m1[2]).toEqual(0);
    // Second row
    expect(m1[3]).toEqual(0);
    expect(m1[4]).toEqual(1);
    expect(m1[5]).toEqual(0);
    // Third row
    expect(m1[6]).toEqual(0);
    expect(m1[7]).toEqual(0);
    expect(m1[8]).toEqual(1);
  });

  it("Should allow helpers for accessing the key matrix values", () => {
    const m1 = new Matrix2D(1, 0, 15, 0, 1, 15);
    // Scaling
    expect(m1.sx).toEqual(1);
    expect(m1.sy).toEqual(1);
    // Translation
    expect(m1.dx).toEqual(15);
    expect(m1.dy).toEqual(15);
  });

  describe(".toTransform", () => {
    it("Should return an array suitable for context2d.setTransform", () => {
      const scaleX = 1;
      const skewY = 2;
      const skewX = 3;
      const scaleY = 4;
      const posX = 5;
      const posY = 6;

      const m1 = new Matrix2D(scaleX, skewX, posX, skewY, scaleY, posY, 7, 8, 9);
      const transform = m1.toTransform();

      expect(transform).toHaveLength(6);
      expect(transform[0]).toEqual(scaleX);
      expect(transform[1]).toEqual(skewY);
      expect(transform[2]).toEqual(skewX);
      expect(transform[3]).toEqual(scaleY);
      expect(transform[4]).toEqual(posX);
      expect(transform[5]).toEqual(posY);
    });
  });

  describe(".fromPoints", () => {
    it("Should allow for generating a matrix with from Vector2's", () => {
      const m1 = Matrix2D.fromPoints(new Vector2(15, 30), new Vector2(1, 2));
      expect(m1.dx).toEqual(15);
      expect(m1.dy).toEqual(30);
      expect(m1.sx).toEqual(1);
      expect(m1.sy).toEqual(2);
    });

    it("Should allow for generating a matrix with from numbers", () => {
      const m1 = Matrix2D.fromPoints(15, 30, 1, 2);
      expect(m1.dx).toEqual(15);
      expect(m1.dy).toEqual(30);
      expect(m1.sx).toEqual(1);
      expect(m1.sy).toEqual(2);
    });
  });

  describe("Arithmetic", () => {
    it("Should add matrices correctly", () => {
      const m1 = Matrix2D.fromPoints(15, 15, 1, 1);
      const m2 = Matrix2D.fromPoints(15, 15, 0, 0);

      m2[8] = 0;
      m1.add(m2);

      expect(m1.sx).toEqual(1);
      expect(m1.sy).toEqual(1);
      expect(m1.dx).toEqual(30);
      expect(m1.dy).toEqual(30);
      expect(m1.values).toEqual([1, 0, 30, 0, 1, 30, 0, 0, 1]);
    });

    it("Should subtract matrices correctly", () => {
      const m1 = Matrix2D.fromPoints(30, 30, 1.5, 1.5);
      const m2 = Matrix2D.fromPoints(15, 15, 1, 1);

      m2[8] = 0;

      m1.subtract(m2);

      expect(m1.sx).toEqual(0.5);
      expect(m1.sy).toEqual(0.5);
      expect(m1.dx).toEqual(15);
      expect(m1.dy).toEqual(15);
      expect(m1.values).toEqual([0.5, 0, 15, 0, 0.5, 15, 0, 0, 1]);
    });

    it("Should multiply matrices by a constant correctly", () => {
      const m1 = new Matrix2D(1, 2, 3, 4, 5, 6, 7, 8, 9);
      m1.multiplyConstant(2);

      expect(m1.sx).toEqual(2);
      expect(m1.sy).toEqual(10);
      expect(m1.dx).toEqual(6);
      expect(m1.dy).toEqual(12);
      expect(m1.values).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18]);
    });

    it("Should multiply matrices correctly", () => {
      const m1 = new Matrix2D(-2, 6, -1, 0, 1, 5, 4, 2, 7);
      const m2 = new Matrix2D(3, 6, -4, -1, 1, 5, 0, -3, 4);

      m1.multiply(m2);

      console.log(m1);
      expect(m1.values).toEqual([-12, -3, 34, -1, -14, 25, 10, 5, 22]);
    });
  });
});
