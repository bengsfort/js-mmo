import { Node2D } from "@js-mmo/core";
import { Square } from "../shapes/square";

export class Root extends Node2D {
  private _square: Square;

  constructor() {
    super();

    this._square = new Square(64, 64);
    this._square.color = "#383838";
    this._square.position.set(32, 32);

  }

  public update(delta: number): void {
    this._square.update(delta);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this._square.render(ctx);
  }
}
