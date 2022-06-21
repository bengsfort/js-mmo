import { Vector2, MathUtils } from "../math";

import { Bounds } from "./bounds";

export class RectBounds extends Bounds {
  public getPoints(): Vector2[] {
    const points = [this.northWest, this.northEast, this.southEast, this.southWest];

    // If no rotation, just return the shape corners
    if (!this.transform) {
      return points;
    }

    const globalPos = this.transform.getWorldPosition();
    const globalRotation = this.transform.getWorldRotation();
    const globalScale = this.transform.getWorldScale();

    return points.map(point => {
      // Apply rotation
      const radians = MathUtils.convertDegreesToRadians(globalRotation);
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      point.x = point.x * cos - point.y * sin;
      point.y = point.x * sin + point.y * cos;

      // Apply scale
      point.multiply(globalScale);

      // Apply offset
      point.x += globalPos.x;
      point.y += globalPos.y;

      return point;
    });
  }

  public includesPoint(point: Vector2): boolean {
    // If there isn't a transform or no rotation, just use the AABB
    if (!this.transform) return this._includesPointAABB(point);

    // Use transformed points to check if the point is inside the bounds
    return false;
  }

  public includesBounds(other: Bounds): boolean {
    if (!this.transform || this._isClean()) {
      return this.includesPoint(other.min) && this.includesPoint(other.max);
    }

    // Transformed points..

    return false;
  }

  public intersects(other: Bounds): boolean {
    if (!this.transform) {
      return this._intersectsAABB(other);
    }

    // Transformed points...

    return false;
  }

  // Includes Point Implementations
  private _includesPointAABB(point: Vector2): boolean {
    return (
      point.x >= this.northWest.x &&
      point.x <= this.southEast.x &&
      point.y >= this.northWest.y &&
      point.y <= this.southEast.y
    );
  }

  // Intersects Implementations
  private _intersectsAABB(other: Bounds): boolean {
    return (
      this.min.x <= other.max.x && this.max.x >= other.min.x && this.max.y >= other.min.y && this.min.y <= other.max.y
    );
  }

  // Helpers
  _isClean(): boolean {
    return (
      this.northWest.x === this.southWest.x &&
      this.northEast.x === this.southEast.x &&
      this.northWest.y === this.northEast.y &&
      this.southWest.y === this.southEast.y
    );
  }

  _rotatePoint(point: Vector2, degrees: number): Vector2 {
    const radians = MathUtils.convertDegreesToRadians(degrees);
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return new Vector2(point.x * cos - point.y * sin, point.x * sin + point.y * cos);
  }
}
