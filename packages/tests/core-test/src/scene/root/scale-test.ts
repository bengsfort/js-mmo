import { Vector2, Easing, Node2D } from "@js-mmo/core";

import { Label } from "../../shapes/label";
import { Square } from "../../shapes/square";

import { KeyframeAnimation } from "./keyframe-animation";

const LABEL_COLOR = "#7D5BA6";
const OUTER_COLOR = "#3C3744";
const INNER_COLOR = "#090C9B";

interface ScaleKeyframe {
  innerScale: number;
  outerScale: number;
  innerTiming(t: number): number;
  outerTiming(t: number): number;
}

const keyframes: ScaleKeyframe[] = [
  {
    innerScale: 1,
    outerScale: 1,
    innerTiming: Easing.smootherstep,
    outerTiming: Easing.easeIn,
  },
  {
    innerScale: 1,
    outerScale: 2,
    innerTiming: Easing.smoothstep,
    outerTiming: Easing.smootherstep,
  },
  {
    innerScale: 0.5,
    outerScale: 2,
    innerTiming: Easing.smootherstep,
    outerTiming: Easing.smootherstep,
  },
];

export class ScaleTest extends Node2D {
  private _titleLabel: Label;
  private _valuesLabel: Label;
  private _outerSquare: Square;
  private _innerSquare: Square;
  private _animation: KeyframeAnimation<ScaleKeyframe>;

  // Animation references
  private _innerStartVector = Vector2.Zero;
  private _innerEndVector = Vector2.Zero;
  private _outerStartVector = Vector2.Zero;
  private _outerEndVector = Vector2.Zero;

  constructor(width: number, height: number) {
    super("ScaleTest");

    this._animation = new KeyframeAnimation<ScaleKeyframe>(keyframes, 300, 1000);
    this._animation.on("new_keyframe", this._onNewKeyframe);

    // Make labels
    this._valuesLabel = new Label("", "16px monospace", LABEL_COLOR);
    this._valuesLabel.position.set(0, -1 * (64 + 16));
    this._titleLabel = new Label("Scale test", "24px monospace", LABEL_COLOR);
    this._titleLabel.position.set(0, -1 * (64 + 16 + 24));
    this.addChild(this._valuesLabel, this._titleLabel);

    // Make outer square
    const outerSquare = new Square(width, height);
    outerSquare.position.set(0, 0); // move to center
    outerSquare.color = OUTER_COLOR;
    this._outerSquare = outerSquare;

    // Make inner square
    const innerSquare = new Square(width / 2, height / 2);
    innerSquare.position.set(0, 0); // move to center
    innerSquare.color = INNER_COLOR;
    this._innerSquare = innerSquare;

    // Add them to the hierarchy
    outerSquare.addChild(innerSquare);
    this.addChild(outerSquare);
  }

  private _onNewKeyframe = (previous: ScaleKeyframe, next: ScaleKeyframe): void => {
    this._innerStartVector.set(previous.innerScale, previous.innerScale);
    this._outerStartVector.set(previous.outerScale, previous.outerScale);
    this._innerEndVector.set(next.innerScale, next.innerScale);
    this._outerEndVector.set(next.outerScale, next.outerScale);
  };

  public getLabel(): string {
    return `parent: ${this._outerSquare.scale.x.toFixed(2)}x, child: ${this._innerSquare.scale.x.toFixed(2)}x`;
  }

  public update(delta: number): void {
    this._animation.update(delta);

    const keyframe = this._animation.getCurrFrame();
    const t = this._animation.getKeyframeTime();

    // If we are finished with the animation, dont do anything.
    if (t >= 1) {
      this._outerSquare.scale.set(keyframe.outerScale, keyframe.outerScale);
      this._innerSquare.scale.set(keyframe.innerScale, keyframe.innerScale);
    } else {
      // Animate
      this._outerSquare.scale = Vector2.Lerp(this._outerStartVector, this._outerEndVector, keyframe.outerTiming(t));
      this._innerSquare.scale = Vector2.Lerp(this._innerStartVector, this._innerEndVector, keyframe.innerTiming(t));
    }

    this._valuesLabel.text = this.getLabel();
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this._outerSquare.render(ctx);
    this._innerSquare.render(ctx);
    this._valuesLabel.render(ctx);
    this._titleLabel.render(ctx);
  }
}
