/**
 * @jest-environment jsdom
 * @todo: remove jsdom for this (only used due to debugging)
 */

import { Vector2 } from "../../math/vector2";
import { Bounds } from "../../math/bounds";
import { WorldCell, WorldUnit } from "../world_cell";
import { QueryableObject } from "../../scene/queryable_object";

describe("WorldCell", () => {
  function makeWorldUnitFromBounds(bounds: Bounds): WorldUnit {
    return new WorldUnit({
      node: new QueryableObject(bounds.position, bounds.size),
    });
  }

  it("should create a cell with the given position and size", () => {
    const cell = new WorldCell(Vector2.Zero, new Vector2(20, 20), 4);
    expect(cell).toBeInstanceOf(WorldCell);
    expect(cell.totalChildCount).toEqual(0);
    expect(cell.boundaries.position.toLiteral()).toEqual({ x: 0, y: 0 });
    expect(cell.boundaries.size.toLiteral()).toEqual({ x: 20, y: 20 });
    expect(cell.boundaries.min.toLiteral()).toEqual({ x: -10, y: -10 });
    expect(cell.boundaries.max.toLiteral()).toEqual({ x: 10, y: 10 });
  });

  it("should store units who are within the boundaries", () => {
    // min -10, -10; max 10, 10
    const cell = new WorldCell(Vector2.Zero, new Vector2(20, 20), 4);
    expect(cell.totalChildCount).toEqual(0);

    const inRegion1 = new WorldUnit({
      node: new QueryableObject(Vector2.One, Vector2.One),
    });
    const inRegion2 = new WorldUnit({
      node: new QueryableObject(new Vector2(-5, -3), Vector2.One),
    });
    const outsideRegion = new WorldUnit({
      node: new QueryableObject(new Vector2(-12, -13), new Vector2(2, 2)),
    });

    expect(cell.insert(inRegion1)).toEqual(true);
    expect(cell.totalChildCount).toEqual(1);

    expect(cell.insert(inRegion2)).toEqual(true);
    expect(cell.totalChildCount).toEqual(2);

    expect(cell.insert(outsideRegion)).toEqual(false);
    expect(cell.totalChildCount).toEqual(2);
  });

  it("should subdivide after getting to the max child count", () => {
    // min -10, -10; max 10, 10
    const cell = new WorldCell(Vector2.Zero, new Vector2(20, 20), 4);
    expect(cell.totalChildCount).toEqual(0);

    const nw = makeWorldUnitFromBounds(new Bounds(new Vector2(-5, 3), Vector2.One));
    const ne = makeWorldUnitFromBounds(new Bounds(new Vector2(3, 6), Vector2.One));
    const sw = makeWorldUnitFromBounds(new Bounds(new Vector2(-8, -7), Vector2.One));
    const se = makeWorldUnitFromBounds(new Bounds(new Vector2(6, -9), Vector2.One));

    cell.insert(nw);
    cell.insert(ne);
    cell.insert(sw);
    cell.insert(se);
    expect(cell.totalCellCount).toEqual(1);
    expect(cell.children.length).toEqual(4);
    expect(cell.totalChildCount).toEqual(4);

    const nw2 = makeWorldUnitFromBounds(new Bounds(new Vector2(-6, 7), Vector2.One));
    cell.insert(nw2);

    expect(cell.totalCellCount).toEqual(5); // this cell + 4 children
    expect(cell.children.length).toEqual(0);
    expect(cell.totalChildCount).toEqual(5);
    expect(cell.totalActiveCellCount).toEqual(4);
  });

  it("Should insert children into it's subdivisions", () => {
    // min: -1, -1; max: 1, 1
    const cell = new WorldCell(Vector2.Zero, new Vector2(2, 2), 1);

    const nw = makeWorldUnitFromBounds(new Bounds(new Vector2(-0.75, 0.75), Vector2.One));
    const ne = makeWorldUnitFromBounds(new Bounds(new Vector2(0.5, 0.5), Vector2.One));
    const sw = makeWorldUnitFromBounds(new Bounds(new Vector2(-0.5, -0.5), Vector2.One));
    const se = makeWorldUnitFromBounds(new Bounds(new Vector2(0.5, -0.5), Vector2.One));

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
    const nw_se = makeWorldUnitFromBounds(new Bounds(new Vector2(-0.25, 0.25), Vector2.One));
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

  it("should remove a point", () => {
    // -10, -10 : 10, 10
    const cell = new WorldCell(Vector2.Zero, new Vector2(20, 20), 3);

    const nwBody1 = makeWorldUnitFromBounds(new Bounds(new Vector2(-5, 5), Vector2.One));
    const nwBody2 = makeWorldUnitFromBounds(new Bounds(new Vector2(-7.5, 7.5), new Vector2(2, 2)));

    cell.insert(nwBody1);
    cell.insert(nwBody2);

    expect(cell.totalChildCount).toEqual(2);
    expect(cell.children).toContain(nwBody2);

    expect(cell.remove(nwBody2)).toEqual(true);
    expect(cell.totalChildCount).toEqual(1);
    expect(cell.children).not.toContain(nwBody2);

    expect(cell.remove(nwBody2)).toEqual(false);
  });

  it("should return if a point or range is within it's boundaries", () => {
    // -5, -5 : 5, 5
    const cell = new WorldCell(Vector2.Zero, new Vector2(10, 10));
    expect(cell.includesPoint(new Vector2(3, -2))).toEqual(true);
    expect(cell.includesRegion(new Bounds(Vector2.One, Vector2.One))).toEqual(true);

    expect(cell.includesPoint(new Vector2(5.5, 6))).toEqual(false);
    expect(cell.includesRegion(new Bounds(new Vector2(10, 10), Vector2.One))).toEqual(false);
  });

  it("should return bodies within the given point/region", () => {
    // -10, -10 : 10, 10
    const cell = new WorldCell(Vector2.Zero, new Vector2(20, 20), 2);

    const nwBody1 = makeWorldUnitFromBounds(new Bounds(new Vector2(-5, 5), Vector2.One));
    const nwBody2 = makeWorldUnitFromBounds(new Bounds(new Vector2(-7.5, 7.5), new Vector2(2, 2)));
    const nwBody3 = makeWorldUnitFromBounds(new Bounds(new Vector2(-2.5, 2.5), Vector2.One));

    const neBody1 = makeWorldUnitFromBounds(new Bounds(new Vector2(2.5, 5), Vector2.One));

    cell.insert(nwBody1);
    cell.insert(nwBody2);
    cell.insert(nwBody3);
    cell.insert(neBody1);

    const pointQueryHit = cell.queryPoint(new Vector2(-8, 8));
    expect(pointQueryHit).toHaveLength(1);
    expect(pointQueryHit).toContain(nwBody2);

    const pointQueryNoHit = cell.queryPoint(new Vector2(-3, -3));
    expect(pointQueryNoHit).toHaveLength(0);

    // -12, 4 : -4, 12
    const hitRegion = new Bounds(new Vector2(-8, 8), new Vector2(8, 8));
    const regionQueryHit = cell.queryRegion(hitRegion);
    expect(regionQueryHit).toHaveLength(2);
    expect(regionQueryHit).toContain(nwBody1);
    expect(regionQueryHit).toContain(nwBody2);
  });
});
