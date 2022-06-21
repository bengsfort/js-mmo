import { Node2D } from "@js-mmo/core";

import { Label } from "../../shapes/label";
import { Square } from "../../shapes/square";

const LABEL_COLOR = "#7D5BA6";
const OUTER_COLOR = "#3C3744";
const INNER_COLOR = "#090C9B";

export class TranslateTest extends Node2D {
  // Sizings
  public columnWidth: number;
  public padding: number;

  private _parentWidth: number;
  private _parentHeight: number;

  // References
  private _titleLabel: Label;
  private _valuesLabel: Label;
  private _outerSquare: Square;
  private _innerSquare: Square;

  constructor(width: number, height: number, colWidth: number, padding: number) {
    super("TranslateTest");

    this._parentWidth = width;
    this._parentHeight = height;

    this.columnWidth = colWidth;
    this.padding = padding;

    // Make labels
    this._valuesLabel = new Label("", "16px monospace", LABEL_COLOR);
    this._valuesLabel.position.set(0, -1 * (height + 16));
    this._titleLabel = new Label("Translate test", "24px monospace", LABEL_COLOR);
    this._titleLabel.position.set(0, -1 * (height + 16 + 24));
    this.addChild(this._valuesLabel, this._titleLabel);

    // Make outer square
    const outerSquare = new Square(width, height);
    outerSquare.position.set(0, 0); // move to center
    outerSquare.color = OUTER_COLOR;
    outerSquare.name = "Translate Test Outer Square";
    this._outerSquare = outerSquare;

    // Make inner square
    const innerSquare = new Square(width / 2, height / 2);
    innerSquare.position.set(0, 0); // move to center
    innerSquare.color = INNER_COLOR;
    innerSquare.name = "Translate Test Inner Square";
    this._innerSquare = innerSquare;

    // Add them to the hierarchy
    outerSquare.addChild(innerSquare);
    this.addChild(outerSquare);
  }

  public getLabel(): string {
    const parentPos = `(${this._outerSquare.position.x.toFixed(2)}, ${this._outerSquare.position.y.toFixed(2)})`;
    const childPos = `(${this._innerSquare.position.x.toFixed(2)}, ${this._innerSquare.position.y.toFixed(2)})`;
    return `parent: ${parentPos} child: ${childPos}`;
  }

  public update(timeframe: number): void {
    // this._innerSquare.position.set((Math.cos(timeframe * 0.005) * this._parentWidth) / 4, 0);
    this._outerSquare.position.set(0, (Math.sin(timeframe * 0.001) * this._parentHeight) / 2);

    this._valuesLabel.text = this.getLabel();
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this._outerSquare.render(ctx);
    this._innerSquare.render(ctx);
    this._valuesLabel.render(ctx);
    this._titleLabel.render(ctx);
  }
}
