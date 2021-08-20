import { Vector2 } from "../../math/vector2";
import { Bounds } from "../bounds";
import { PhysCell } from "../phys_cell";

describe("PhysCell", () => {
  it("should create a cell with the given position and size", () => {
    const cell = new PhysCell(Vector2.Zero, new Vector2(20, 20), 4);
    expect(cell).toBeInstanceOf(PhysCell);
    expect(cell.totalChildCount).toEqual(0);
    expect(cell.boundaries.position.toLiteral()).toEqual({ x: 0, y: 0 });
    expect(cell.boundaries.size.toLiteral()).toEqual({ x: 20, y: 20 });
    expect(cell.boundaries.min.toLiteral()).toEqual({ x: -10, y: -10 });
    expect(cell.boundaries.max.toLiteral()).toEqual({ x: 10, y: 10 });
  });

  it("should store units who are within the boundaries", () => {
    // min -10, -10; max 10, 10
    const cell = new PhysCell(Vector2.Zero, new Vector2(20, 20), 4);
    expect(cell.totalChildCount).toEqual(0);

    const inRegion1 = new Bounds(Vector2.One, Vector2.One);
    const inRegion2 = new Bounds(new Vector2(-5, -3), Vector2.One);
    const outsideRegion = new Bounds(new Vector2(-12, -13), new Vector2(2, 2));

    expect(cell.insert(inRegion1)).toEqual(true);
    expect(cell.totalChildCount).toEqual(1);

    expect(cell.insert(inRegion2)).toEqual(true);
    expect(cell.totalChildCount).toEqual(2);

    expect(cell.insert(outsideRegion)).toEqual(false);
    expect(cell.totalChildCount).toEqual(2);
  });

  it("should subdivide after getting to the max child count", () => {
    // min -10, -10; max 10, 10
    const cell = new PhysCell(Vector2.Zero, new Vector2(20, 20), 4);
    expect(cell.totalChildCount).toEqual(0);

    const nw = new Bounds(new Vector2(-5, 3), Vector2.One);
    const ne = new Bounds(new Vector2(3, 6), Vector2.One);
    const sw = new Bounds(new Vector2(-8, -7), Vector2.One);
    const se = new Bounds(new Vector2(6, -9), Vector2.One);

    cell.insert(nw);
    cell.insert(ne);
    cell.insert(sw);
    cell.insert(se);
    expect(cell.totalCellCount).toEqual(1);
    expect(cell.children.length).toEqual(4);
    expect(cell.totalChildCount).toEqual(4);

    const nw2 = new Bounds(new Vector2(-6, 7), Vector2.One);
    cell.insert(nw2);

    expect(cell.totalCellCount).toEqual(5); // this cell + 4 children
    expect(cell.children.length).toEqual(0);
    expect(cell.totalChildCount).toEqual(5);
    expect(cell.totalActiveCellCount).toEqual(4);
  });

  it("Should insert children into it's subdivisions", () => {
    // min: -1, -1; max: 1, 1
    const cell = new PhysCell(Vector2.Zero, new Vector2(2, 2), 1);

    const nw = new Bounds(new Vector2(-0.75, 0.75), Vector2.One);
    const ne = new Bounds(new Vector2(0.5, 0.5), Vector2.One);
    const sw = new Bounds(new Vector2(-0.5, -0.5), Vector2.One);
    const se = new Bounds(new Vector2(0.5, -0.5), Vector2.One);

    expect(cell.insert(nw)).toEqual(true);
    expect(cell.totalChildCount).toEqual(1);
    expect(cell.totalCellCount).toEqual(1);
    expect(cell.totalActiveCellCount).toEqual(1);
    expect(cell.nw).toBeUndefined();
    expect(cell.ne).toBeUndefined();
    expect(cell.sw).toBeUndefined();
    expect(cell.se).toBeUndefined();

    expect(cell.insert(ne)).toEqual(true);
    expect(cell.totalChildCount).toEqual(2);
    expect(cell.totalCellCount).toEqual(5);
    expect(cell.totalActiveCellCount).toEqual(2);
    expect(cell.nw).toBeDefined();
    expect(cell.nw?.totalChildCount).toEqual(1);
    expect(cell.ne).toBeDefined();
    expect(cell.nw?.totalChildCount).toEqual(1);
    expect(cell.sw).toBeDefined();
    expect(cell.sw?.totalChildCount).toEqual(0);
    expect(cell.se).toBeDefined();
    expect(cell.se?.totalChildCount).toEqual(0);

    expect(cell.insert(sw)).toEqual(true);
    expect(cell.totalChildCount).toEqual(3);
    expect(cell.totalActiveCellCount).toEqual(3);
    expect(cell.nw?.totalChildCount).toEqual(1);
    expect(cell.nw?.totalChildCount).toEqual(1);
    expect(cell.sw?.totalChildCount).toEqual(1);

    expect(cell.insert(se)).toEqual(true);
    expect(cell.totalChildCount).toEqual(4);
    expect(cell.totalActiveCellCount).toEqual(4);
    expect(cell.nw?.totalChildCount).toEqual(1);
    expect(cell.nw?.totalChildCount).toEqual(1);
    expect(cell.sw?.totalChildCount).toEqual(1);
    expect(cell.se?.totalChildCount).toEqual(1);

    // Make sure children can subdivide similarly
    const nw_se = new Bounds(new Vector2(-0.25, 0.25), Vector2.One);
    expect(cell.insert(nw_se)).toEqual(true);
    expect(cell.totalChildCount).toEqual(5);
    expect(cell.totalActiveCellCount).toEqual(5);
    expect(cell.totalCellCount).toEqual(9);

    expect(cell.nw?.totalChildCount).toEqual(2);
    expect(cell.nw?.totalActiveCellCount).toEqual(2);
    expect(cell.nw?.totalCellCount).toEqual(5);
    expect(cell.nw?.nw?.totalChildCount).toEqual(1);
    expect(cell.nw?.se?.totalChildCount).toEqual(1);
  });
});
