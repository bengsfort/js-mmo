import { QueryableObject } from "../scene/queryable_object";
import { Vector2 } from "../math/vector2";
import { Bounds } from "../math/bounds";

interface WorldUnitOpts {
  node: QueryableObject;
  layer?: number;
  cell?: WorldCell;
}

export class WorldUnit {
  public layer: number;
  public node: QueryableObject;
  public cell?: WorldCell;

  constructor({ layer = 0, node, cell }: WorldUnitOpts) {
    this.layer = layer;
    this.node = node;
    this.cell = cell;
  }

  includesPoint(point: Vector2): boolean {
    return this.node.bounds.includesPoint(point);
  }

  intersects(region: Bounds): boolean {
    return this.node.bounds.intersects(region);
  }
}

// Quadtree
export class WorldCell {
  public readonly maxChildren: number;
  public boundaries: Bounds;

  public children: WorldUnit[]; // @todo: change to physics bodies
  public get root(): WorldCell {
    if (this._parent !== null) {
      return this.parent as WorldCell;
    }
    return this;
  }

  public get parent(): WorldCell | null {
    return this._parent;
  }
  private _parent: WorldCell | null = null;
  private _nw?: WorldCell;
  private _ne?: WorldCell;
  private _sw?: WorldCell;
  private _se?: WorldCell;

  public get nw(): WorldCell | undefined {
    return this._nw;
  }
  public get ne(): WorldCell | undefined {
    return this._ne;
  }
  public get sw(): WorldCell | undefined {
    return this._sw;
  }
  public get se(): WorldCell | undefined {
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

  constructor(pos: Vector2, size: Vector2, maxChildren = 5, parent?: WorldCell) {
    this.boundaries = new Bounds(pos, size);
    this.maxChildren = maxChildren;
    this.children = [];
    this._parent = parent ?? null;
  }

  // @todo: implement, use phys bodies not points
  insert(body: WorldUnit): boolean {
    // Ignore objects that don't belong here
    // @todo: what if the `size` of a body pushes into another cell? duplicate? Store in both? fuck.
    if (!this.includesPoint(body.node.bounds.position)) {
      console.log(
        "BODY DOES NOT EXIST IN THIS CELL (pos, boundsMin, boundsMax, parent)",
        body.node.bounds.position,
        this.boundaries.min,
        this.boundaries.max,
        this.parent
      );
      return false;
    }

    // If there is space here and there are no subdivisions, add it
    if (!this._nw && this.children.length <= this.maxChildren) {
      this.children.push(body);
      this.children.sort((a, b) => a.node.bounds.position.y - b.node.bounds.position.y); // sort by position on y axis
      body.cell = this;
      console.log("ADDED TO THIS CELL");
      return true;
    }

    // Otherwise, subdivide then add to wherever it belongs
    if (!this._nw) {
      console.log("SUBDIVIDING CELL");
      this.subdivide();
    }

    if (this._nw?.insert(body)) {
      console.log("ADDED TO NW CELL");
      return true;
    }
    if (this._ne?.insert(body)) {
      console.log("ADDED TO NE CELL");
      return true;
    }
    if (this._sw?.insert(body)) {
      console.log("ADDED TO SW CELL");
      return true;
    }
    if (this._se?.insert(body)) {
      console.log("ADDED TO SE CELL");
      return true;
    }

    // Otherwise, we can't insert it somehow (this should NEVER occur)
    console.log("Somehow didn't add to anything");
    return false;
  }

  remove(body: WorldUnit): boolean {
    // Ignore objects that don't belong.
    if (!this.includesPoint(body.node.bounds.position)) {
      return false;
    }

    // If there are children in here, check for it + delete.
    if (!this._nw && this.children.length > 0) {
      const index = this.children.indexOf(body);
      if (index === -1) return false;
      this.children = this.children.filter(b => b !== body);
      return true;
    }

    if (this._nw?.remove(body)) return true;
    if (this._ne?.remove(body)) return true;
    if (this._sw?.remove(body)) return true;
    if (this._se?.remove(body)) return true;

    // Otherwise, we can't remove it (this should NEVER occur)
    return false;
  }

  private subdivide() {
    const centerpoint = this.boundaries.position.copy();
    const quadrantSize = this.boundaries.halfSize.copy();
    const quadrantOffset = Vector2.MultiplyScalar(quadrantSize, 0.5);

    this._nw = new WorldCell(
      new Vector2(centerpoint.x - quadrantOffset.x, centerpoint.y + quadrantOffset.y),
      quadrantSize,
      this.maxChildren,
      this
    );
    this._ne = new WorldCell(
      new Vector2(centerpoint.x + quadrantOffset.x, centerpoint.y + quadrantOffset.y),
      quadrantSize,
      this.maxChildren,
      this
    );
    this._sw = new WorldCell(
      new Vector2(centerpoint.x - quadrantOffset.x, centerpoint.y - quadrantOffset.y),
      quadrantSize,
      this.maxChildren,
      this
    );
    this._se = new WorldCell(
      new Vector2(centerpoint.x + quadrantOffset.x, centerpoint.y - quadrantOffset.y),
      quadrantSize,
      this.maxChildren,
      this
    );

    // Remove the references from this one and redistribute
    const children = this.children.splice(0, this.maxChildren);
    children.forEach(child => this.insert(child));
  }

  // Querying
  // Get all children that include provided point
  queryPoint(point: Vector2): QueryableObject[] {
    // Only continue if the point is included.
    // @todo: This check happens twice for children. Figure out a way to better do this...
    if (!this.includesPoint(point)) return [];

    // If there are no subdivisions, just check the children of this cell for a hit
    if (!this._nw) {
      const result = [];
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].includesPoint(point)) {
          result.push(this.children[i].node);
        }
      }
      return result;
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
  queryRegion(region: Bounds): QueryableObject[] {
    // Only continue if the region is included.
    // @todo: This check happens twice for children. Figure out a way to better do this...
    if (!this.includesRegion(region)) return [];

    // If there are no subdivisions, check the children of this cell.
    if (!this._nw) {
      const result = [];
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].intersects(region)) {
          result.push(this.children[i].node);
        }
      }
      return result;
    }

    // If there are subdivisions, find the one that includes this point.
    let hits: QueryableObject[] = [];
    if (this._nw?.includesRegion(region)) hits = hits.concat(this._nw.queryRegion(region));
    if (this._ne?.includesRegion(region)) hits = hits.concat(this._ne.queryRegion(region));
    if (this._sw?.includesRegion(region)) hits = hits.concat(this._sw.queryRegion(region));
    if (this._se?.includesRegion(region)) hits = hits.concat(this._se.queryRegion(region));
    return hits;
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
