import { Bounds, Node2D, Vector2 } from "@js-mmo/core";

import { Label } from "../shapes/label";
import { getShowBounds } from "../utils/debug";

import { RotateTest } from "./root/rotate-test";
import { ScaleTest } from "./root/scale-test";
import { TranslateTest } from "./root/translate-test";

export class Root extends Node2D {
  private _scaleTest: ScaleTest;
  private _rotateTest: RotateTest;
  private _translateTest: TranslateTest;

  private _viewportWidth: number;
  private _viewportHeight: number;

  private _leftCol: Bounds;
  private _rightCol: Bounds;

  constructor() {
    super();

    this._viewportWidth = window.innerWidth;
    this._viewportHeight = window.innerHeight;

    // These get placed by `this.resize`
    this._scaleTest = new ScaleTest(64, 64);
    this._rotateTest = new RotateTest(64, 64);
    this._translateTest = new TranslateTest(64, 64, 32, 16);

    // Setup columns
    this._leftCol = new Bounds(new Vector2(0, 0), new Vector2(this._viewportWidth * 0.5, this._viewportHeight));
    this._rightCol = new Bounds(
      new Vector2(this._viewportWidth * 0.5, 0),
      new Vector2(this._viewportWidth * 0.5, this._viewportHeight)
    );

    this.addChild(this._scaleTest, this._rotateTest);
    this.resize(this._viewportWidth, this._viewportHeight);
  }

  private _getRowCenter(row: number, numRows: number): number {
    const rowHeight = this._viewportHeight / numRows;
    const rowCenter = rowHeight / 2;
    return row * rowHeight - rowCenter;
  }

  public resize(width: number, height: number) {
    this._viewportWidth = width;
    this._viewportHeight = height;

    const halfHeight = height * 0.5;
    const halfWidth = width * 0.5;

    this._leftCol.position = new Vector2(halfWidth * 0.5, halfHeight);
    this._leftCol.size = new Vector2(halfWidth, height);
    this._rightCol.position = new Vector2(halfWidth + 0.5 * halfWidth, halfHeight);
    this._rightCol.size = new Vector2(halfWidth, halfHeight);

    this._scaleTest.position.set(this._leftCol.position.x, this._getRowCenter(1, 2));
    this._rotateTest.position.set(this._leftCol.position.x, this._getRowCenter(2, 2));
    this._translateTest.position.set(this._rightCol.position.x, halfHeight);
  }

  public update(delta: number): void {
    // const bounds = getShowBounds();
    // this._scaleTest.debug = bounds;
    // this._scaleTestTEMP.debug = bounds;

    this._scaleTest.update(delta);
    this._rotateTest.update(delta);
    this._translateTest.update(delta);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this._scaleTest.render(ctx);
    this._rotateTest.render(ctx);
    this._translateTest.render(ctx);
  }
}
