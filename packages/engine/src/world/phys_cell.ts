import { Vector2 } from "../math/vector2";

import { Bounds } from "./bounds";

// Quadtree
export class PhysCell {
  public readonly maxChildren: number;
  public boundaries: Bounds;

  public children: Bounds[]; // @todo: change to physics bodies

  private _nw?: PhysCell;
  private _ne?: PhysCell;
  private _sw?: PhysCell;
  private _se?: PhysCell;

  public get nw(): PhysCell | undefined {
    return this._nw;
  }
  public get ne(): PhysCell | undefined {
    return this._ne;
  }
  public get sw(): PhysCell | undefined {
    return this._sw;
  }
  public get se(): PhysCell | undefined {
    return this._se;
  }

  public get totalChildCount(): number {
    let count = this.children.length;
    count += this._nw?.totalChildCount ?? 0;
    count += this._ne?.totalChildCount ?? 0;
    count += this._sw?.totalChildCount ?? 0;
    count += this._se?.totalChildCount ?? 0;
    return count;
  }

  public get totalCellCount(): number {
    let count = 1; // this cell.
    count += this._nw?.totalCellCount ?? 0;
    count += this._ne?.totalCellCount ?? 0;
    count += this._sw?.totalCellCount ?? 0;
    count += this._se?.totalCellCount ?? 0;
    return count;
  }

  public get totalActiveCellCount(): number {
    let count = 0;
    if (this.children.length > 0) count += 1;
    count += this._nw?.totalActiveCellCount ?? 0;
    count += this._ne?.totalActiveCellCount ?? 0;
    count += this._sw?.totalActiveCellCount ?? 0;
    count += this._se?.totalActiveCellCount ?? 0;
    return count;
  }

  constructor(pos: Vector2, size: Vector2, maxChildren = 5) {
    this.boundaries = new Bounds(pos, size);
    this.maxChildren = maxChildren;
    this.children = [];
  }

  // @todo: implement, use phys bodies not points
  insert(body: Bounds): boolean {
    // Ignore objects that don't belong here
    // @todo: what if the `size` of a body pushes into another cell? duplicate? Store in both? fuck.
    if (!this.includesPoint(body.position)) {
      return false;
    }

    // If there is space here and there are no subdivisions, add it
    if (!this._nw && this.children.length < this.maxChildren) {
      this.children.push(body);
      this.children.sort((a, b) => a.position.y - b.position.y); // sort by position on y axis
      return true;
    }

    // Otherwise, subdivide then add to wherever it belongs
    if (!this._nw) {
      this.subdivide();
    }

    if (this._nw?.insert(body)) return true;
    if (this._ne?.insert(body)) return true;
    if (this._sw?.insert(body)) return true;
    if (this._se?.insert(body)) return true;

    // Otherwise, we can't insert it somehow (this should NEVER occur)
    return false;
  }

  subdivide() {
    const centerpoint = this.boundaries.position;
    const quadrantSize = this.boundaries.halfSize;
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
  queryPoint(point: Vector2): Bounds[] {
    // Only continue if the point is included.
    // @todo: This check happens twice for children. Figure out a way to better do this...
    if (!this.includesPoint(point)) return [];

    // If there are no subdivisions, just check the children of this cell for a hit
    if (!this._nw) {
      return this.children.filter(child => child.includesPoint(point));
    }

    // If there are subdivisions, find the one that includes this point.
    if (this._nw?.includesPoint(point)) return this._nw.queryPoint(point);
    if (this._ne?.includesPoint(point)) return this._ne.queryPoint(point);
    if (this._sw?.includesPoint(point)) return this._sw.queryPoint(point);
    if (this._se?.includesPoint(point)) return this._se.queryPoint(point);

    // Return an empty array if nothing exists.
    return [];
  }

  // Get all children within the provided range
  queryRegion(region: Bounds): Bounds[] {
    // Only continue if the region is included.
    // @todo: This check happens twice for children. Figure out a way to better do this...
    if (!this.includesRegion(region)) return [];

    // If there are no subdivisions, check the children of this cell.
    if (!this._nw) {
      return this.children.filter(child => child.intersects(region));
    }

    // If there are subdivisions, find the one that includes this point.
    if (this._nw?.includesRegion(region)) return this._nw.queryRegion(region);
    if (this._ne?.includesRegion(region)) return this._ne.queryRegion(region);
    if (this._sw?.includesRegion(region)) return this._sw.queryRegion(region);
    if (this._se?.includesRegion(region)) return this._se.queryRegion(region);

    // Return an empty array if nothing exists.
    return [];
  }

  // Is the point included in this cell?
  includesPoint(point: Vector2): boolean {
    return this.boundaries.includesPoint(point);
  }

  // Is the region included in this cell?
  includesRegion(region: Bounds): boolean {
    return this.boundaries.intersects(region);
  }
}
