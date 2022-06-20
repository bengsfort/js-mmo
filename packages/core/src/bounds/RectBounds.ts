import { Vector2 } from "../math";

import { Bounds } from "./bounds";

export class RectBounds extends Bounds {
  public getPoints(): Vector2[] {
    return [this.northWest, this.northEast, this.southEast, this.southWest];
  }

  public includesPoint(point: Vector2): boolean {
    throw new Error("Method not implemented.");
  }

  public includesBounds(other: Bounds): boolean {
    throw new Error("Method not implemented.");
  }

  public intersects(other: Bounds): boolean {
    throw new Error("Method not implemented.");
  }
}
