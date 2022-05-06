import { Node2D } from "@js-mmo/core";

import { getShowBounds } from "../utils/debug";

import { ScaleTest } from "./root/scale-test";

export class Root extends Node2D {
  private _scaleTest: ScaleTest;

  constructor() {
    super();

    this._scaleTest = new ScaleTest(64, 64);
    this._scaleTest.position.set(128, 128);
    this.addChild(this._scaleTest);
  }

  public update(delta: number): void {
    const bounds = getShowBounds();
    this._scaleTest.debug = bounds;
    this._scaleTest.update(delta);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this._scaleTest.render(ctx);
  }
}
