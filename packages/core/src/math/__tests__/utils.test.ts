import * as MathUtils from "../utils";

describe("MathUtils", () => {
  describe("clamp", () => {
    it("should return either the min or max if given value exceeds them", () => {
      expect(MathUtils.clamp(-1, 0, 10)).toEqual(0);
      expect(MathUtils.clamp(15, 0, 10)).toEqual(10);
    });

    it("should return the value if between the min and max", () => {
      expect(MathUtils.clamp(5, 0, 10)).toEqual(5);
      expect(MathUtils.clamp(0.01, 0, 10)).toEqual(0.01);
      expect(MathUtils.clamp(9.99, 0, 10)).toEqual(9.99);
    });
  });

  describe("transformRange", () => {
    it("should transform a value from one range to another", () => {
      expect(MathUtils.transformRange(3, 1, 5, 0, 100)).toEqual(50);
      expect(MathUtils.transformRange(50, 0, 100)).toEqual(0.5);
    });
  });
});
