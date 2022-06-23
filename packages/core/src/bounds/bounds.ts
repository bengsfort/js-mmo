import { Node2D } from "../objects";
import { Vector2 } from "../math/vector2";
import { Transform } from "../math/transform";

export abstract class Bounds {
  public transform?: Transform;
  public size: Vector2;
  public offset: Vector2;
  public debugColor = "#f0f";

  public get position(): Vector2 {
    return this.transform?.getWorldPosition() ?? this.offset;
  }

  // Primitive operations
  public get halfSize(): Vector2 {
    return Vector2.MultiplyScalar(this.size, 0.5);
  }
  public get min(): Vector2 {
    return Vector2.Subtract(this.offset, this.halfSize);
  }
  public get max(): Vector2 {
    return Vector2.Add(this.offset, this.halfSize);
  }

  // Directions
  public get northWest(): Vector2 {
    return this.min;
  }
  public get northEast(): Vector2 {
    return new Vector2(this.max.x, this.min.y);
  }
  public get southWest(): Vector2 {
    return new Vector2(this.min.x, this.max.y);
  }
  public get southEast(): Vector2 {
    return this.max;
  }

  constructor(position: Vector2, size: Vector2, transform?: Transform) {
    this.offset = position;
    this.size = size;
    this.transform = transform;
  }

  // Direction Helpers
  public isAboveOf(other: Bounds): boolean {
    return this.max.y > other.min.y;
  }

  public isBelowOf(other: Bounds): boolean {
    return this.min.y < other.max.y;
  }

  public isLeftOf(other: Bounds): boolean {
    return this.max.x < other.min.x;
  }

  public isRightOf(other: Bounds): boolean {
    return this.min.x > other.max.x;
  }

  // Debug
  public drawDebug(ctx: CanvasRenderingContext2D): void {
    const points = this.getPoints();

    ctx.save();
    ctx.strokeStyle = this.debugColor;
    ctx.beginPath();

    // Draw from the origin of the shape
    ctx.moveTo(this.position.x, this.position.y);
    for (let i = 0; i < points.length; i++) {
      ctx.lineTo(points[i % points.length].x, points[i % points.length].y);
      ctx.strokeText(`${i}`, points[i % points.length].x, points[i % points.length].y);
    }
    ctx.lineTo(points[0].x, points[0].y);

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  // Operations
  public abstract getPoints(): Vector2[];
  public abstract includesPoint(point: Vector2): boolean;
  public abstract includesBounds(other: Bounds): boolean;
  public abstract intersects(other: Bounds): boolean;
}

/*
public get points(): Vector2[] {
  return [this.northWest, this.northEast, this.southEast, this.southWest];
}
*/

// export class Bounds {
//   private _pos: Vector2;
//   private _size: Vector2;

//   private _min!: Vector2;
//   private _max!: Vector2;

//   // Get/set for main properties
//   public set position(value: Vector2) {
//     if (this._pos.equals(value)) return;

//     this._pos = value;
//     this._calculateExtents(value, this._size);
//   }
//   public get position(): Vector2 {
//     return this._pos;
//   }

//   public set size(value: Vector2) {
//     this._size = value;
//     this._calculateExtents(this._pos, value);
//   }
//   public get size(): Vector2 {
//     return this._size;
//   }

//   // Helper getters
//   public get halfSize(): Vector2 {
//     return Vector2.MultiplyScalar(this._size, 0.5);
//   }
//   public get min(): Vector2 {
//     return this._min;
//   }
//   public get max(): Vector2 {
//     return this._max;
//   }
//   public get left(): number {
//     return this._min.x;
//   }
//   public get right(): number {
//     return this._max.x;
//   }
//   public get top(): number {
//     return this._min.y;
//   }
//   public get bottom(): number {
//     return this._max.y;
//   }
//   public get northEast(): Vector2 {
//     return new Vector2(this._max.x, this._min.y);
//   }
//   public get northWest(): Vector2 {
//     return new Vector2(this._min.x, this._min.y);
//   }
//   public get southEast(): Vector2 {
//     return new Vector2(this._max.x, this._max.y);
//   }
//   public get southWest(): Vector2 {
//     return new Vector2(this._min.x, this._max.y);
//   }

//   constructor(position: Vector2, size: Vector2) {
//     this._pos = position.copy();
//     this._size = size.copy();
//     this._calculateExtents(position, size);
//   }

//   // North = top (min),
//   // South = bottom (max),
//   // West = left (min),
//   // East = right (max)
//   private _calculateExtents(pos: Vector2, size: Vector2): void {
//     const half = Vector2.MultiplyScalar(size, 0.5);
//     const min = Vector2.Subtract(pos, half);
//     const max = Vector2.Add(pos, half);

//     this._min = min;
//     this._max = max;
//   }

//   // Inclusion + intersections
//   public includesPoint(point: Vector2): boolean {
//     return point.x >= this.left && point.y <= this.bottom && point.x <= this.right && point.y >= this.top;
//   }

//   public includesBounds(other: Bounds): boolean {
//     return this.includesPoint(other.min) && this.includesPoint(other.max);
//   }

//   public intersects(other: Bounds): boolean {
//     return this.left <= other.right && this.right >= other.left && this.bottom >= other.top && this.top <= other.bottom;
//   }

//   // Directions
//   public isLeftOf(point: Vector2): boolean {
//     return point.x > this.right;
//   }
//   public isRightOf(point: Vector2): boolean {
//     return point.x < this.left;
//   }
//   // @todo: might need to swap these
//   public isAbove(point: Vector2): boolean {
//     return point.y < this.bottom;
//   }
//   public isBelow(point: Vector2): boolean {
//     return point.y > this.top;
//   }
// }
