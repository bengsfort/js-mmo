import { Bounds } from "../bounds";
import { Vector2 } from "../../math/vector2";

describe("Bounds", () => {
  it("should store its position and size", () => {
    const pos = new Vector2(5, 5);
    const size = new Vector2(10, 10);
    const bounds = new Bounds(pos, size);
    expect(bounds).toBeInstanceOf(Bounds);
    expect(bounds.position.toLiteral()).toEqual(pos.toLiteral());
    expect(bounds.size.toLiteral()).toEqual(size.toLiteral());
  });

  it("should calculate its extents and expose them", () => {
    const pos = new Vector2(5, 5);
    const size = new Vector2(10, 10);
    const bounds = new Bounds(pos, size);

    expect(bounds.halfSize).toBeDefined();
    expect(bounds.halfSize).toHaveProperty("x", 5);
    expect(bounds.halfSize).toHaveProperty("y", 5);

    expect(bounds.min).toBeDefined();
    expect(bounds.min).toHaveProperty("x", 0);
    expect(bounds.min).toHaveProperty("y", 0);

    expect(bounds.max).toBeDefined();
    expect(bounds.max).toHaveProperty("x", 10);
    expect(bounds.max).toHaveProperty("y", 10);

    expect(bounds).toHaveProperty("minX", 0);
    expect(bounds).toHaveProperty("minY", 0);
    expect(bounds).toHaveProperty("maxX", 10);
    expect(bounds).toHaveProperty("maxY", 10);
  });

  it("should recalculate its extents when position or size changes", () => {
    const pos = new Vector2(5, 5);
    const size = new Vector2(10, 10);
    const bounds = new Bounds(pos, size);

    expect(bounds.halfSize.toLiteral()).toEqual({ x: 5, y: 5 });
    expect(bounds.min.toLiteral()).toEqual({ x: 0, y: 0 });
    expect(bounds.max.toLiteral()).toEqual({ x: 10, y: 10 });

    bounds.position = new Vector2(2, 2);
    expect(bounds.halfSize.toLiteral()).toEqual({ x: 5, y: 5 });
    expect(bounds.min.toLiteral()).toEqual({ x: -3, y: -3 });
    expect(bounds.max.toLiteral()).toEqual({ x: 7, y: 7 });

    bounds.size = new Vector2(6, 6);
    expect(bounds.halfSize.toLiteral()).toEqual({ x: 3, y: 3 });
    expect(bounds.min.toLiteral()).toEqual({ x: -1, y: -1 });
    expect(bounds.max.toLiteral()).toEqual({ x: 5, y: 5 });
  });

  it("should return its direction relative to a point", () => {
    // min: 15, 15; max: 25, 25
    const bounds = new Bounds(new Vector2(20, 20), new Vector2(10, 10));

    const rightOfBounds = new Vector2(30, 0);
    const leftOfBounds = new Vector2(-10, 0);
    const aboveBounds = new Vector2(0, 30);
    const belowBounds = new Vector2(0, -15);

    // Horizontal
    expect(bounds.isLeftOf(rightOfBounds)).toEqual(true);
    expect(bounds.isLeftOf(leftOfBounds)).toEqual(false);
    expect(bounds.isRightOf(leftOfBounds)).toEqual(true);
    expect(bounds.isRightOf(rightOfBounds)).toEqual(false);

    // Vertical
    expect(bounds.isAbove(belowBounds)).toEqual(true);
    expect(bounds.isAbove(aboveBounds)).toEqual(false);
    expect(bounds.isBelow(aboveBounds)).toEqual(true);
    expect(bounds.isBelow(belowBounds)).toEqual(false);
  });

  it("should return it's 4 corner points", () => {
    const pos = new Vector2(5, 5);
    const size = new Vector2(10, 10);
    const bounds = new Bounds(pos, size);

    expect(bounds.northEast.toLiteral()).toEqual({ x: 10, y: 10 });
    expect(bounds.northWest.toLiteral()).toEqual({ x: 0, y: 10 });
    expect(bounds.southEast.toLiteral()).toEqual({ x: 10, y: 0 });
    expect(bounds.southWest.toLiteral()).toEqual({ x: 0, y: 0 });
  });

  it("should return whether or not a given point is included in its bounds", () => {
    // min: 15, 15; max: 25, 25
    const bounds = new Bounds(new Vector2(20, 20), new Vector2(10, 10));

    const inBounds = new Vector2(18, 23);
    const outOfBounds = new Vector2(100, 20);
    expect(bounds.includesPoint(inBounds)).toEqual(true);
    expect(bounds.includesPoint(outOfBounds)).toEqual(false);
  });

  it("should return whether or not a given Bounds is within it", () => {
    // min 15, 15; max 25, 25
    const bounds = new Bounds(new Vector2(20, 20), new Vector2(10, 10));
    // min 18, 18; max 22, 22
    const included = new Bounds(new Vector2(20, 20), new Vector2(4, 4));
    // min 27, 27; max: 33, 33
    const excluded = new Bounds(new Vector2(30, 30), new Vector2(6, 6));

    expect(bounds.includesBounds(included)).toEqual(true);
    expect(bounds.includesBounds(excluded)).toEqual(false);
  });

  // For a visual test, see engine_tests/bounds_test
  it("should return whether or not a given Bounds intersects", () => {
    // min 15, 15; max 25, 25
    const bounds = new Bounds(new Vector2(20, 20), new Vector2(10, 10));

    // min 24, 24;  max 30, 30
    /*
      +----+
    +-|-+  |
    | | |  |
    | +-|--+
    +---+
    */
    const intersectsNE = new Bounds(new Vector2(27, 27), new Vector2(6, 6));
    expect(bounds.intersects(intersectsNE)).toEqual(true);

    // min 10, 24;  max 16, 30
    /*
    +---+
    |  +|--+
    +--|+  |
       +---+
    */
    const intersectsNW = new Bounds(new Vector2(13, 27), new Vector2(6, 6));
    expect(bounds.intersects(intersectsNW)).toEqual(true);

    // min 23, 10; max 31, 16
    /*
    +---+
    |  +|--+
    +--|+  |
       +---+
    */
    const intersectsSE = new Bounds(new Vector2(27, 13), new Vector2(8, 6));
    expect(bounds.intersects(intersectsSE)).toEqual(true);

    // min 9, 10; max 17, 16
    /*
      +----+
    +-|-+  |
    | | |  |
    | +-|--+
    +---+
    */
    const intersectsSW = new Bounds(new Vector2(13, 13), new Vector2(8, 6));
    expect(bounds.intersects(intersectsSW)).toEqual(true);

    // min 8, 10; max 18, 30
    /*
    +--+
    | +|--+
    | ||  |
    | +|--+
    +--+
    */
    const intersectsTopBottom = new Bounds(new Vector2(13, 20), new Vector2(10, 20));
    expect(bounds.intersects(intersectsTopBottom)).toEqual(true);
  });
});
