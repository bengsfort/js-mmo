import { Node2D } from "@js-mmo/core";

import { Label } from "../shapes/label";
import { getShowBounds } from "../utils/debug";

import { ScaleTest } from "./root/scale-test";

export class Root extends Node2D {
  private _scaleLabel: Label;
  private _scaleTest: ScaleTest;
  private _scaleTestTEMP: ScaleTest;

  private _viewportWidth: number;
  private _viewportHeight: number;

  constructor() {
    super();

    this._viewportWidth = window.innerWidth;
    this._viewportHeight = window.innerHeight;

    // This gets placed by `this.resize`
    this._scaleTest = new ScaleTest(64, 64);
    this._scaleLabel = new Label("Scale test", "24px monospace", "#7D5BA6");
    this._scaleTestTEMP = new ScaleTest(64, 64);

    this.addChild(this._scaleTest, this._scaleLabel, this._scaleTestTEMP);
    this.resize(this._viewportWidth, this._viewportHeight);
  }

  private _getLeftColumnCenter() {
    const colEnd = this._viewportWidth * 0.25;
    return colEnd / 2;
  }

  private _getLeftColumnRowCenter(row: number, numRows: number): number {
    const rowHeight = this._viewportHeight / numRows;
    const rowCenter = rowHeight / 2;
    return row * rowHeight - rowCenter;
  }

  public resize(width: number, height: number) {
    this._viewportWidth = width;
    this._viewportHeight = height;

    this._scaleTest.position.set(this._getLeftColumnCenter(), this._getLeftColumnRowCenter(1, 2));
    this._scaleLabel.position.set(this._getLeftColumnCenter(), this._getLeftColumnRowCenter(1, 2) - (64 + 16));
    this._scaleTestTEMP.position.set(this._getLeftColumnCenter(), this._getLeftColumnRowCenter(2, 2));
  }

  public update(delta: number): void {
    const bounds = getShowBounds();
    this._scaleTest.debug = bounds;
    this._scaleTestTEMP.debug = bounds;

    this._scaleTest.update(delta);
    this._scaleTestTEMP.update(delta);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this._scaleTest.render(ctx);
    this._scaleLabel.render(ctx);
    this._scaleTestTEMP.render(ctx);
  }
}
