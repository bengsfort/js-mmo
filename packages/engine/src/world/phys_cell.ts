import { Vector2 } from "../math/vector2";

import { Bounds } from "./bounds";

// Quadtree
export class PhysCell {
  public readonly maxChildren: number;
  public bounds: Bounds;
  public children: Vector2[]; // @todo: change to physics bodies

  private _nw?: PhysCell;
  private _ne?: PhysCell;
  private _sw?: PhysCell;
  private _se?: PhysCell;

  constructor(pos: Vector2, size: Vector2, maxChildren = 5) {
    this.bounds = new Bounds(pos, size);
    this.maxChildren = maxChildren;
    this.children = [];
  }

  // @todo: implement, use phys bodies not points
  insert(point: Vector2): boolean {
    // Ignore objects that don't belong here
    if (!this.includesPoint(point)) {
      return false;
    }

    // If there is space here and there are no subdivisions, add it
    if (this._nw === null && this.children.length < this.maxChildren) {
      this.children.push(point);
      this.children.sort((a, b) => a.y - b.y); // sort by position on y axis
    }

    // Otherwise, subdivide then add to wherever it belongs
    if (this._nw === null) this.subdivide();

    if (this._nw?.insert(point)) return true;
    if (this._ne?.insert(point)) return true;
    if (this._sw?.insert(point)) return true;
    if (this._se?.insert(point)) return true;

    // Otherwise, we can't insert it somehow (this should NEVER occur)
    return false;
  }

  subdivide() {
    const centerpoint = this.bounds.position;
    const quadrantSize = this.bounds.halfSize;
    const quadrantOffset = Vector2.MultiplyScalar(quadrantSize, 0.5);

    this._nw = new PhysCell(
      new Vector2(centerpoint.x - quadrantOffset.x, centerpoint.y + quadrantOffset.y),
      quadrantSize,
      this.maxChildren
    );
    this._ne = new PhysCell(
      new Vector2(centerpoint.x + quadrantOffset.x, centerpoint.y + quadrantOffset.y),
      quadrantSize,
      this.maxChildren
    );
    this._sw = new PhysCell(
      new Vector2(centerpoint.x - quadrantOffset.x, centerpoint.y - quadrantOffset.y),
      quadrantSize,
      this.maxChildren
    );
    this._se = new PhysCell(
      new Vector2(centerpoint.x + quadrantOffset.x, centerpoint.y - quadrantOffset.y),
      quadrantSize,
      this.maxChildren
    );

    // Remove the references from this one and redistribute
    const children = this.children.splice(0, this.maxChildren);
    children.forEach(child => this.insert(child));
  }

  // Querying
  // Get all children that include provided point
  queryPoint(point: Vector2): Vector2[] {
    // @todo: iterate through children/cells to find bounds that includes point
    return [];
  }

  // Get all children within the provided range
  queryRegion(region: Bounds): Vector2[] {
    // @todo: iterate through children/cells to find bounds that overlap/intersect with the region queried
    return [];
  }

  // Is the point included in this cell?
  includesPoint(point: Vector2): boolean {
    return this.bounds.includesPoint(point);
  }

  // Is the region included in this cell?
  includesRegion(region: Bounds): boolean {
    return this.bounds.includesBounds(region);
  }
}
